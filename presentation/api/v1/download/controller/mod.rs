use axum::body::Body;
use axum::extract::{Path, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::Response;
use axum::routing::get;
use axum::Router;
use tokio::io::{AsyncReadExt, AsyncSeekExt};
use tokio_util::io::ReaderStream;

use crate::domain::media::services::serve_download::serve_download;
use crate::infrastructure::exceptions::AppError;
use crate::presentation::state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new().route("/download/{token}", get(download_handler))
}

async fn download_handler(
    State(state): State<AppState>,
    Path(token): Path<String>,
    headers: HeaderMap,
) -> Result<Response, AppError> {
    let prepared =
        serve_download(state.token.as_ref(), state.media_store.as_ref(), &token).await?;
    let size = prepared.size;
    let (start, end, status) = parse_range(headers.get(header::RANGE), size)?;
    let length = end - start + 1;

    let mut file = tokio::fs::File::open(&prepared.path)
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to open media: {e}"),
        })?;
    file.seek(std::io::SeekFrom::Start(start))
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to seek media: {e}"),
        })?;

    let disposition = format!(
        "attachment; filename=\"{}\"",
        prepared.file_name.replace('"', "")
    );
    let body = Body::from_stream(ReaderStream::new(file.take(length)));

    let mut builder = Response::builder()
        .status(status)
        .header(header::CONTENT_TYPE, prepared.content_type.as_str())
        .header(header::ACCEPT_RANGES, "bytes")
        .header(header::CONTENT_LENGTH, length)
        .header(
            header::CONTENT_DISPOSITION,
            HeaderValue::from_str(&disposition).unwrap_or_else(|_| {
                HeaderValue::from_static("attachment; filename=\"download.bin\"")
            }),
        );

    if status == StatusCode::PARTIAL_CONTENT {
        builder = builder.header(
            header::CONTENT_RANGE,
            format!("bytes {start}-{end}/{size}"),
        );
    }

    builder.body(body).map_err(|e| AppError::Internal {
        message: format!("failed to build response: {e}"),
    })
}

fn parse_range(
    range_header: Option<&axum::http::HeaderValue>,
    size: u64,
) -> Result<(u64, u64, StatusCode), AppError> {
    if size == 0 {
        return Ok((0, 0, StatusCode::OK));
    }

    let Some(raw) = range_header.and_then(|v| v.to_str().ok()) else {
        return Ok((0, size - 1, StatusCode::OK));
    };

    let Some(spec) = raw.strip_prefix("bytes=") else {
        return Ok((0, size - 1, StatusCode::OK));
    };

    let (start_s, end_s) = spec.split_once('-').unwrap_or((spec, ""));
    let start: u64 = if start_s.is_empty() {
        0
    } else {
        start_s.parse().unwrap_or(0)
    };
    let end: u64 = if end_s.is_empty() {
        size - 1
    } else {
        end_s.parse().unwrap_or(size - 1).min(size - 1)
    };

    if start > end || start >= size {
        return Err(AppError::BadRequest {
            message: "invalid range".into(),
            field: None,
        });
    }

    Ok((start, end, StatusCode::PARTIAL_CONTENT))
}
