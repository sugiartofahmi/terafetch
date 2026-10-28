use std::env;
use std::path::PathBuf;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    #[allow(dead_code)]
    pub version: String,
    pub secret_key: String,
    pub media_temp_dir: PathBuf,
    #[allow(dead_code)]
    pub media_ttl_secs: u64,
    pub public_base_url: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            host: env::var("APP_HOST").unwrap_or_else(|_| "0.0.0.0".into()),
            port: env::var("APP_PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(3100),
            version: env::var("APP_VERSION").unwrap_or_else(|_| "1.0.0".into()),
            secret_key: env::var("SECRET_KEY")
                .unwrap_or_else(|_| "dev-only-change-me-terafetch-secret".into()),
            media_temp_dir: env::var("MEDIA_TEMP_DIR")
                .map(PathBuf::from)
                .unwrap_or_else(|_| PathBuf::from("/tmp/terafetch-media")),
            media_ttl_secs: env::var("MEDIA_TTL_SECS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(3600),
            public_base_url: env::var("PUBLIC_BASE_URL")
                .unwrap_or_else(|_| "http://localhost:3100".into()),
        }
    }
}
