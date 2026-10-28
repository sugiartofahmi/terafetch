use axum::Router;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

use crate::presentation::api::health::controller as health_controller;
use crate::presentation::api::v1::download::controller as download_controller;
use crate::presentation::api::v1::play::controller as play_controller;
use crate::presentation::api::v1::result::controller as result_controller;
use crate::presentation::api::v1::stream::controller as stream_controller;
use crate::presentation::state::AppState;

pub fn build_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .merge(health_controller::routes())
        .nest(
            "/api/v1",
            Router::new()
                .merge(result_controller::routes())
                .merge(stream_controller::routes())
                .merge(play_controller::routes())
                .merge(download_controller::routes()),
        )
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(state)
}
