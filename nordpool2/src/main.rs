use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, DateTime, FixedOffset, Utc};
use chrono::TimeZone;

#[derive(Serialize, Deserialize, Debug)]
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
#[serde(rename_all(serialize = "PascalCase"))]
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
            let mut prices = get_price_array(&json.data.rows, 1);
            let mut prices_latest_day = get_price_array(&json.data.rows, 0);
            prices.append(&mut prices_latest_day);
            println!("{:?}", prices);
            return HttpResponse::Ok().json(prices);        
        },
        Err(error) => return HttpResponse::InternalServerError().body(error.to_string()),
    };
}
 
fn get_price_array(data_rows: &Vec<Row>, days_ago: usize) -> Vec<Price> {
    data_rows.iter()
    .filter(|row| !row.is_extra_row)
    .map(|row| 
        Price { 
            date_time: parse_date(&row.columns[days_ago].name, &row.start_time), 
            price: ((row.columns[days_ago].value.clone().replace(",", ".").parse::<f64>().unwrap() / 10.0 * 1.24 + 0.24) * 1000.0).round() / 1000.0
        }
    )
    .collect::<Vec<Price>>()
}

fn parse_date(date_cet: &String, time_local: &String) -> chrono::DateTime<Utc> {
    let date_str = date_cet.split('-').rev().collect::<Vec<&str>>().join("-");
    let time_str = &time_local[11..19];
    let date_constructed = date_str + "T" + time_str;

    let tz_offset = FixedOffset::east(1 * 3600);
    tz_offset.from_local_datetime(
        &NaiveDateTime::parse_from_str(&date_constructed, "%Y-%m-%dT%H:%M:%S").unwrap()
    ).unwrap().with_timezone(&Utc)
}

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
