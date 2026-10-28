pub fn hd_thumb_url(url: &str) -> String {
    url.replace("size=c850_u580", "size=c1920_u1080")
        .replace("size=c360_u270", "size=c1920_u1080")
        .replace("size=c140_u90", "size=c1920_u1080")
}
