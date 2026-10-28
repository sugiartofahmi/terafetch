mod domain;
mod infrastructure;
mod presentation;

use std::net::SocketAddr;
use std::sync::Arc;

use tracing_subscriber::EnvFilter;

use crate::infrastructure::config::AppConfig;
use crate::infrastructure::media::temp_store::TempMediaStore;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::token::hmac::HmacTokenService;
use crate::presentation::state::AppState;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let config = AppConfig::from_env();
    let terabox = Arc::new(TeraboxClient::new().await?);
    let media_store = TempMediaStore::new(&config.media_temp_dir, Arc::clone(&terabox))?;
    let token = HmacTokenService::new(&config.secret_key, &config.public_base_url);

    let state = AppState {
        config: Arc::new(config.clone()),
        terabox,
        media_store: Arc::new(media_store),
        token: Arc::new(token),
    };

    let app = presentation::api::router::build_router(state);

    let addr = SocketAddr::from((config.host.parse::<std::net::IpAddr>()?, config.port));
    tracing::info!(%addr, "terafetch listening");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
