use axum::{serve, Router};
use tower_http::{compression::CompressionLayer, services::ServeDir, trace::TraceLayer};
use tracing::info;
use tracing_subscriber::fmt::format::FmtSpan;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_span_events(FmtSpan::CLOSE)
        .init();

    let router = Router::new()
        .fallback_service(ServeDir::new("../dist"))
        .layer(
            CompressionLayer::new()
                .gzip(true)
                .deflate(true)
                .zstd(true)
                .br(true),
        )
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    info!("listening on port 3000");
    serve(listener, router).await.unwrap();
}
