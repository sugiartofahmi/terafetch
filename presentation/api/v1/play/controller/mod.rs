use axum::body::Body;
use axum::extract::{Path, State};
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::Response;
use axum::routing::get;
use axum::Router;
use tokio::io::{AsyncReadExt, AsyncSeekExt};
use tokio_util::io::ReaderStream;

use crate::domain::media::constants::MP4_CONTENT_TYPE;
use crate::domain::media::services::serve_play::serve_play;
use crate::infrastructure::exceptions::AppError;
use crate::presentation::state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new().route("/play/{token}", get(play_handler))
}

async fn play_handler(
    State(state): State<AppState>,
    Path(token): Path<String>,
    headers: HeaderMap,
) -> Result<Response, AppError> {
    let prepared = serve_play(state.token.as_ref(), state.media_store.as_ref(), &token).await?;
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

    let body = Body::from_stream(ReaderStream::new(file.take(length)));

    let mut builder = Response::builder()
        .status(status)
        .header(header::CONTENT_TYPE, MP4_CONTENT_TYPE)
        .header(header::ACCEPT_RANGES, "bytes")
        .header(header::CONTENT_LENGTH, length)
        .header(header::CACHE_CONTROL, "public, max-age=3600");

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
