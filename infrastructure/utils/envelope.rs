use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

pub const API_VERSION: &str = "1.0.0";

#[derive(Debug, Clone, Serialize)]
pub struct ApiResponse<T: Serialize> {
    pub status_code: u16,
    pub version: String,
    pub data: T,
}

#[derive(Debug, Clone, Serialize)]
pub struct ApiFieldError {
    pub field: String,
    pub message: String,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn ok(data: T) -> Self {
        Self {
            status_code: StatusCode::OK.as_u16(),
            version: API_VERSION.to_string(),
            data,
        }
    }
}

impl<T: Serialize> IntoResponse for ApiResponse<T> {
    fn into_response(self) -> Response {
        (StatusCode::from_u16(self.status_code).unwrap_or(StatusCode::OK), Json(self)).into_response()
    }
}
