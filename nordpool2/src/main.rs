use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, DateTime, FixedOffset, Utc};
use chrono::TimeZone;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "lowercase"))]
struct PriceInput {
    data: Data,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "PascalCase"))]
struct Data {
    rows: Vec<Row>,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "PascalCase"))]
struct Row {
    columns: Vec<Column>,
    start_time: String,
    is_extra_row: bool
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "PascalCase"))]
struct Column {
    value: String,
    name: String,
}

#[derive(Serialize, Debug)]
struct Price {
    date_time: DateTime<Utc>,
    price: f64
}

async fn greet() -> impl Responder {
    let url = "https://www.nordpoolgroup.com/api/marketdata/page/35?currency=,EUR,EUR,EUR&entityName=FI";
    //let url ="asdfjl";
    let price_response = reqwest::get(url).await;
    match price_response {
        Ok(prices_response) => {
            let json = prices_response.json::<PriceInput>().await.unwrap();
            let prices = json.data.rows.into_iter()
            .filter(|item| !item.is_extra_row)
            .map(|item| {
                let tz_offset = FixedOffset::east(1 * 3600);
                return Price { 
                    date_time: tz_offset.from_local_datetime(
                        &NaiveDateTime::parse_from_str(&item.start_time, "%Y-%m-%dT%H:%M:%S").unwrap()
                    ).unwrap().with_timezone(&Utc), 
                    price: ((item.columns[0].value.clone().replace(",", ".").parse::<f64>().unwrap() / 10.0 * 1.24 + 0.24) * 1000.0).round() / 1000.0
                }
            })
            .collect::<Vec<Price>>();
            println!("{:?}", prices);
            return HttpResponse::Ok().json(prices);        
        },
        Err(error) => return HttpResponse::InternalServerError().body(error.to_string()),
    };
}
/* 
fn get_price_array(dataRows: serde_json::Array, daysAgo: u8) {

}*/

#[actix_web::main]
async fn main() -> std::io::Result<()>  {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(greet))
            .route("/{name}", web::get().to(greet))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
