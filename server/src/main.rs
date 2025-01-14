use tower_http::services::ServeDir;
use axum::{serve, Router};

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let router = Router::new()
        .fallback_service(ServeDir::new("../dist"));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    serve(listener, router)
        .await
        .unwrap();
}
