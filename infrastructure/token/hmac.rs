use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use hmac::{Hmac, Mac};
use sha2::Sha256;

use crate::domain::media::dtos::{MediaKind, MediaTokenClaimsResultDto, MintMediaTokenRequestDto};
use crate::domain::media::services::serve_play::MediaTokenVerifier;
use crate::domain::stream::dtos::SignMediaUrlRequestDto;
use crate::domain::stream::services::get_stream::StreamTokenSigner;
use crate::infrastructure::exceptions::AppError;

type HmacSha256 = Hmac<Sha256>;

const TOKEN_TTL_SECS: i64 = 3600;

#[derive(Clone)]
pub struct HmacTokenService {
    secret: Vec<u8>,
    public_base_url: String,
}

impl HmacTokenService {
    pub fn new(secret: &str, public_base_url: &str) -> Self {
        Self {
            secret: secret.as_bytes().to_vec(),
            public_base_url: public_base_url.trim_end_matches('/').to_string(),
        }
    }

    fn sign_payload(&self, payload: &str) -> String {
        let mut mac =
            HmacSha256::new_from_slice(&self.secret).expect("HMAC key length is valid");
        mac.update(payload.as_bytes());
        let sig = mac.finalize().into_bytes();
        format!(
            "{}.{}",
            URL_SAFE_NO_PAD.encode(payload.as_bytes()),
            hex::encode(sig)
        )
    }

    fn mint(&self, request: MintMediaTokenRequestDto) -> Result<String, AppError> {
        let exp = chrono::Utc::now().timestamp() + TOKEN_TTL_SECS;
        let kind_str = match request.kind {
            MediaKind::Play => "play",
            MediaKind::Download => "download",
        };
        let mut payload = format!(
            "{kind_str}|{exp}|{}|{}",
            request.file_id, request.share_url
        );
        if let Some(asset_url) = request.asset_url.as_ref() {
            payload.push_str("|asset|");
            payload.push_str(&URL_SAFE_NO_PAD.encode(asset_url.as_bytes()));
            let name = request.file_name.as_deref().unwrap_or("download.bin");
            payload.push('|');
            payload.push_str(&URL_SAFE_NO_PAD.encode(name.as_bytes()));
        }
        Ok(self.sign_payload(&payload))
    }

    fn parse(&self, token: &str) -> Result<MediaTokenClaimsResultDto, AppError> {
        let (payload_b64, sig_hex) = token.split_once('.').ok_or_else(|| AppError::Unauthorized {
            message: "invalid token".into(),
        })?;

        let payload_bytes = URL_SAFE_NO_PAD
            .decode(payload_b64)
            .map_err(|_| AppError::Unauthorized {
                message: "invalid token encoding".into(),
            })?;
        let payload = String::from_utf8(payload_bytes).map_err(|_| AppError::Unauthorized {
            message: "invalid token payload".into(),
        })?;

        let mut mac =
            HmacSha256::new_from_slice(&self.secret).expect("HMAC key length is valid");
        mac.update(payload.as_bytes());
        let expected = hex::encode(mac.finalize().into_bytes());
        if !constant_time_eq(&expected, sig_hex) {
            return Err(AppError::Unauthorized {
                message: "invalid token signature".into(),
            });
        }

        let mut parts = payload.split('|');
        let kind_str = parts.next().unwrap_or_default();
        let exp: i64 = parts
            .next()
            .and_then(|v| v.parse().ok())
            .ok_or_else(|| AppError::Unauthorized {
                message: "invalid token exp".into(),
            })?;
        let file_id = parts
            .next()
            .ok_or_else(|| AppError::Unauthorized {
                message: "invalid token file id".into(),
            })?
            .to_string();
        let share_url = parts
            .next()
            .ok_or_else(|| AppError::Unauthorized {
                message: "invalid token share url".into(),
            })?
            .to_string();

        let mut asset_url = None;
        let mut file_name = None;
        if parts.next() == Some("asset") {
            if let Some(asset_b64) = parts.next() {
                asset_url = URL_SAFE_NO_PAD
                    .decode(asset_b64)
                    .ok()
                    .and_then(|b| String::from_utf8(b).ok());
            }
            if let Some(name_b64) = parts.next() {
                file_name = URL_SAFE_NO_PAD
                    .decode(name_b64)
                    .ok()
                    .and_then(|b| String::from_utf8(b).ok());
            }
        }

        let kind = match kind_str {
            "play" => MediaKind::Play,
            "download" => MediaKind::Download,
            _ => {
                return Err(AppError::Unauthorized {
                    message: "invalid token kind".into(),
                })
            }
        };

        Ok(MediaTokenClaimsResultDto {
            kind,
            share_url,
            file_id,
            exp,
            asset_url,
            file_name,
        })
    }
}

impl StreamTokenSigner for HmacTokenService {
    fn play_url(&self, request: SignMediaUrlRequestDto) -> Result<String, AppError> {
        let token = self.mint(MintMediaTokenRequestDto {
            kind: MediaKind::Play,
            share_url: request.share_url,
            file_id: request.file_id,
            asset_url: None,
            file_name: None,
        })?;
        Ok(format!("{}/api/v1/play/{}", self.public_base_url, token))
    }

    fn download_url(&self, request: SignMediaUrlRequestDto) -> Result<String, AppError> {
        let token = self.mint(MintMediaTokenRequestDto {
            kind: MediaKind::Download,
            share_url: request.share_url,
            file_id: request.file_id,
            asset_url: request.asset_url,
            file_name: request.file_name,
        })?;
        Ok(format!(
            "{}/api/v1/download/{}",
            self.public_base_url, token
        ))
    }
}

impl MediaTokenVerifier for HmacTokenService {
    fn verify(&self, token: &str) -> Result<MediaTokenClaimsResultDto, AppError> {
        self.parse(token)
    }
}

fn constant_time_eq(a: &str, b: &str) -> bool {
    if a.len() != b.len() {
        return false;
    }
    a.bytes()
        .zip(b.bytes())
        .fold(0u8, |acc, (x, y)| acc | (x ^ y))
        == 0
}
