use axum::extract::{Query, State};
use axum::routing::get;
use axum::Router;

use crate::domain::stream::dtos::{GetStreamRequestDto, GetStreamResultDto};
use crate::domain::stream::services::get_stream::get_stream;
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::utils::envelope::ApiResponse;
use crate::presentation::state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new().route("/stream", get(get_stream_handler))
}

async fn get_stream_handler(
    State(state): State<AppState>,
    Query(request): Query<GetStreamRequestDto>,
) -> Result<ApiResponse<GetStreamResultDto>, AppError> {
    let output = get_stream(state.terabox.as_ref(), state.token.as_ref(), request).await?;
    Ok(ApiResponse::ok(output))
}
