use std::path::Path;

use tokio::io::AsyncWriteExt;

use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;

pub async fn download_url_to_file(
    client: &TeraboxClient,
    url: &str,
    dest: &Path,
) -> Result<(), AppError> {
    if let Some(parent) = dest.parent() {
        tokio::fs::create_dir_all(parent)
            .await
            .map_err(|e| AppError::Internal {
                message: format!("failed to create asset dir: {e}"),
            })?;
    }

    let bytes = client
        .http
        .get(url)
        .header("Referer", "https://www.terabox.com/")
        .send()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("asset download failed: {e}"),
        })?
        .error_for_status()
        .map_err(|e| AppError::Internal {
            message: format!("asset http error: {e}"),
        })?
        .bytes()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("asset body failed: {e}"),
        })?;

    if bytes.len() < 100 {
        return Err(AppError::Internal {
            message: "asset download returned empty body".into(),
        });
    }

    let mut file = tokio::fs::File::create(dest)
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to create asset file: {e}"),
        })?;
    file.write_all(&bytes).await.map_err(|e| AppError::Internal {
        message: format!("failed to write asset file: {e}"),
    })?;
    file.flush().await.map_err(|e| AppError::Internal {
        message: format!("failed to flush asset file: {e}"),
    })?;

    Ok(())
}
