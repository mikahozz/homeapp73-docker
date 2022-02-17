use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Debug)]
pub struct PriceInput {
    pub data: Data,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Data {
    pub rows: Vec<Row>,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Row {
    pub columns: Vec<Column>,
    pub start_time: String,
    pub is_extra_row: bool
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Column {
    pub value: String,
    pub name: String,
}

#[derive(Serialize, Debug)]
#[serde(rename_all(serialize = "PascalCase"))]
pub struct Price {
    pub date_time: DateTime<Utc>,
    pub price: f64
}
