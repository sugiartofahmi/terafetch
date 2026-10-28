use std::sync::Arc;

use crate::infrastructure::config::AppConfig;
use crate::infrastructure::media::temp_store::TempMediaStore;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::token::hmac::HmacTokenService;

#[derive(Clone)]
pub struct AppState {
    #[allow(dead_code)]
    pub config: Arc<AppConfig>,
    pub terabox: Arc<TeraboxClient>,
    pub media_store: Arc<TempMediaStore>,
    pub token: Arc<HmacTokenService>,
}
