use axum::extract::{Query, State};
use axum::routing::get;
use axum::Router;

use crate::domain::result::dtos::{ListResultRequestDto, ListResultResultDto};
use crate::domain::result::services::list_result::list_result;
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::utils::envelope::ApiResponse;
use crate::presentation::state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new().route("/result", get(get_result))
}

async fn get_result(
    State(state): State<AppState>,
    Query(request): Query<ListResultRequestDto>,
) -> Result<ApiResponse<ListResultResultDto>, AppError> {
    let output = list_result(state.terabox.as_ref(), state.token.as_ref(), request).await?;
    Ok(ApiResponse::ok(output))
}
