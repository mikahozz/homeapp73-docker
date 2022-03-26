use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use chrono::{NaiveDateTime, FixedOffset, Utc};
use chrono::TimeZone;
mod price_models;
use crate::price_models::*;

async fn greet() -> impl Responder {
    let url = "https://www.nordpoolgroup.com/api/marketdata/page/35?currency=,EUR,EUR,EUR&entityName=FI";
    let price_response = reqwest::get(url).await;
    match price_response {
        Ok(prices_response) => {
            let json = prices_response.json::<PriceInput>().await.unwrap();
            let mut prices = get_price_array(&json.data.rows, 1);
            let mut prices_latest_day = get_price_array(&json.data.rows, 0);
            prices.append(&mut prices_latest_day);
            return HttpResponse::Ok().json(prices);        
        },
        Err(error) => return HttpResponse::InternalServerError().body(error.to_string()),
    };
}
 
fn get_price_array(data_rows: &Vec<Row>, days_ago: usize) -> Vec<Price> {
    data_rows.iter()
    .filter(|row| !row.is_extra_row)
    .map(|row| 
        {
            let price_string = row.columns[days_ago].value.clone().replace(",", ".");
            let price = price_string.parse::<f64>()
            .unwrap_or_else(|err| {
                panic!("Could not parsefloat the value {}: {} ", price_string, err);
            } );
            return Price { 
                date_time: parse_date(&row.columns[days_ago].name, &row.start_time), 
                price: ((price / 10.0 * 1.24 + 0.24) * 1000.0).round() / 1000.0
            }    
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
    })
    .bind(("0.0.0.0", 3014))?
    .run()
    .await
}
