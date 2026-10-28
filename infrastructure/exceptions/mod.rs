use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

use crate::infrastructure::utils::envelope::{ApiFieldError, API_VERSION};

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("{message}")]
    BadRequest {
        message: String,
        field: Option<String>,
    },
    #[error("{message}")]
    NotFound { message: String },
    #[error("{message}")]
    Unauthorized { message: String },
    #[error("{message}")]
    TooManyRequests { message: String },
    #[error("{message}")]
    Internal { message: String },
}

impl AppError {
    pub fn status(&self) -> StatusCode {
        match self {
            Self::BadRequest { .. } => StatusCode::BAD_REQUEST,
            Self::NotFound { .. } => StatusCode::NOT_FOUND,
            Self::Unauthorized { .. } => StatusCode::UNAUTHORIZED,
            Self::TooManyRequests { .. } => StatusCode::TOO_MANY_REQUESTS,
            Self::Internal { .. } => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn message(&self) -> &str {
        match self {
            Self::BadRequest { message, .. }
            | Self::NotFound { message }
            | Self::Unauthorized { message }
            | Self::TooManyRequests { message }
            | Self::Internal { message } => message,
        }
    }
}

#[derive(Debug, Serialize)]
struct ErrorEnvelope {
    error_message: String,
    errors: Vec<ApiFieldError>,
    status_code: u16,
    version: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = self.status();
        let errors = match &self {
            AppError::BadRequest {
                message,
                field: Some(field),
            } => vec![ApiFieldError {
                field: field.clone(),
                message: message.clone(),
            }],
            _ => Vec::new(),
        };

        if matches!(self, AppError::Internal { .. }) {
            tracing::error!(error = %self, "internal error");
        }

        let body = ErrorEnvelope {
            error_message: self.message().to_string(),
            errors,
            status_code: status.as_u16(),
            version: API_VERSION.to_string(),
        };

        (status, Json(body)).into_response()
    }
}
