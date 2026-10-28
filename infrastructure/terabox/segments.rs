use std::path::Path;

use tokio::io::AsyncWriteExt;

use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;

pub async fn download_segments(
    client: &TeraboxClient,
    urls: &[String],
    dest: &Path,
) -> Result<(), AppError> {
    if let Some(parent) = dest.parent() {
        tokio::fs::create_dir_all(parent)
            .await
            .map_err(|e| AppError::Internal {
                message: format!("failed to create segment dir: {e}"),
            })?;
    }

    let mut file = tokio::fs::File::create(dest)
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to create assemble file: {e}"),
        })?;

    for url in urls {
        let bytes = client
            .http
            .get(url)
            .header("Referer", "https://www.terabox.com/")
            .send()
            .await
            .map_err(|e| AppError::Internal {
                message: format!("segment download failed: {e}"),
            })?
            .error_for_status()
            .map_err(|e| AppError::Internal {
                message: format!("segment http error: {e}"),
            })?
            .bytes()
            .await
            .map_err(|e| AppError::Internal {
                message: format!("segment body failed: {e}"),
            })?;

        file.write_all(&bytes).await.map_err(|e| AppError::Internal {
            message: format!("segment write failed: {e}"),
        })?;
    }

    file.flush().await.map_err(|e| AppError::Internal {
        message: format!("segment flush failed: {e}"),
    })?;

    Ok(())
}
