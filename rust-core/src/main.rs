use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::{get, post, put, delete},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing::{info, instrument};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone)]
pub struct AppState {
    pub redis_client: redis::Client,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub ai_models: Vec<String>,
    pub config: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub ai_models: Vec<String>,
    pub config: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
    pub timestamp: DateTime<Utc>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
            timestamp: Utc::now(),
        }
    }

    pub fn error(error: String) -> ApiResponse<()> {
        ApiResponse {
            success: false,
            data: None,
            error: Some(error),
            timestamp: Utc::now(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthCheck {
    pub status: String,
    pub version: String,
    pub uptime: u64,
    pub services: HashMap<String, String>,
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/v1/projects", get(list_projects).post(create_project))
        .route("/api/v1/projects/:id", get(get_project).put(update_project).delete(delete_project))
        .route("/api/v1/ai/models", get(list_ai_models))
        .route("/api/v1/ai/inference", post(ai_inference))
        .with_state(Arc::new(state))
        .layer(CorsLayer::permissive())
}

#[instrument]
async fn root() -> Json<ApiResponse<String>> {
    Json(ApiResponse::success("AI-Powered BaaS Core Service - Rust Backend".to_string()))
}

#[instrument]
async fn health_check() -> Json<ApiResponse<HealthCheck>> {
    let mut services = HashMap::new();
    services.insert("database".to_string(), "healthy".to_string());
    services.insert("redis".to_string(), "healthy".to_string());
    services.insert("ai_services".to_string(), "healthy".to_string());

    let health = HealthCheck {
        status: "healthy".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        uptime: 3600, // This would be calculated properly in production
        services,
    };

    Json(ApiResponse::success(health))
}

#[instrument]
async fn list_projects(
    State(state): State<Arc<AppState>>,
) -> Result<Json<ApiResponse<Vec<Project>>>, StatusCode> {
    // This would query the actual database
    let projects = vec![
        Project {
            id: Uuid::new_v4(),
            name: "Demo Project".to_string(),
            description: Some("A demonstration project".to_string()),
            created_at: Utc::now(),
            updated_at: Utc::now(),
            ai_models: vec!["gemini-pro".to_string(), "custom-classifier".to_string()],
            config: serde_json::json!({"ai_enabled": true, "real_time": true}),
        }
    ];

    Ok(Json(ApiResponse::success(projects)))
}

#[instrument]
async fn create_project(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateProjectRequest>,
) -> Result<Json<ApiResponse<Project>>, StatusCode> {
    let project = Project {
        id: Uuid::new_v4(),
        name: request.name,
        description: request.description,
        created_at: Utc::now(),
        updated_at: Utc::now(),
        ai_models: request.ai_models,
        config: request.config.unwrap_or_else(|| serde_json::json!({})),
    };

    // In production, this would save to the database
    info!("Created new project: {}", project.id);

    Ok(Json(ApiResponse::success(project)))
}

#[instrument]
async fn get_project(
    Path(id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<ApiResponse<Project>>, StatusCode> {
    // This would query the actual database
    let project = Project {
        id,
        name: "Sample Project".to_string(),
        description: Some("A sample project for demonstration".to_string()),
        created_at: Utc::now(),
        updated_at: Utc::now(),
        ai_models: vec!["gemini-pro".to_string()],
        config: serde_json::json!({"ai_enabled": true}),
    };

    Ok(Json(ApiResponse::success(project)))
}

#[instrument]
async fn update_project(
    Path(id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateProjectRequest>,
) -> Result<Json<ApiResponse<Project>>, StatusCode> {
    let project = Project {
        id,
        name: request.name,
        description: request.description,
        created_at: Utc::now(),
        updated_at: Utc::now(),
        ai_models: request.ai_models,
        config: request.config.unwrap_or_else(|| serde_json::json!({})),
    };

    info!("Updated project: {}", project.id);

    Ok(Json(ApiResponse::success(project)))
}

#[instrument]
async fn delete_project(
    Path(id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<ApiResponse<String>>, StatusCode> {
    // In production, this would delete from the database
    info!("Deleted project: {}", id);

    Ok(Json(ApiResponse::success(format!("Project {} deleted successfully", id))))
}

#[instrument]
async fn list_ai_models() -> Json<ApiResponse<Vec<serde_json::Value>>> {
    let models = vec![
        serde_json::json!({
            "id": "gemini-pro",
            "name": "Gemini Pro",
            "type": "nlp",
            "provider": "google",
            "capabilities": ["text-generation", "chat", "summarization"]
        }),
        serde_json::json!({
            "id": "custom-classifier",
            "name": "Custom Text Classifier",
            "type": "classification",
            "provider": "internal",
            "capabilities": ["text-classification", "sentiment-analysis"]
        }),
    ];

    Json(ApiResponse::success(models))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIInferenceRequest {
    pub model_id: String,
    pub input: serde_json::Value,
    pub parameters: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIInferenceResponse {
    pub model_id: String,
    pub output: serde_json::Value,
    pub metadata: serde_json::Value,
}

#[instrument]
async fn ai_inference(
    State(state): State<Arc<AppState>>,
    Json(request): Json<AIInferenceRequest>,
) -> Result<Json<ApiResponse<AIInferenceResponse>>, StatusCode> {
    // This would integrate with the Python AI services
    let response = AIInferenceResponse {
        model_id: request.model_id.clone(),
        output: serde_json::json!({
            "result": "This is a mock response from the Rust core service",
            "confidence": 0.95
        }),
        metadata: serde_json::json!({
            "processing_time_ms": 150,
            "model_version": "1.0.0",
            "provider": if request.model_id.starts_with("gemini") { "google" } else { "internal" }
        }),
    };

    info!("AI inference completed for model: {}", request.model_id);

    Ok(Json(ApiResponse::success(response)))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    // Load environment variables
    dotenv::dotenv().ok();

    // Redis connection (mock for now)
    let redis_url = std::env::var("REDIS_URL")
        .unwrap_or_else(|_| "redis://localhost:6379".to_string());
    let redis_client = redis::Client::open(redis_url)?;

    let state = AppState {
        redis_client,
    };

    let app = create_router(state);

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()?;

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    
    info!("🚀 AI-Powered BaaS Core Service starting on port {}", port);
    info!("📚 Health check available at http://localhost:{}/health", port);
    info!("🔧 API documentation at http://localhost:{}/api/v1", port);

    axum::serve(listener, app).await?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_health_check() {
        let redis_client = redis::Client::open("redis://localhost:6379").unwrap();
        
        let state = AppState {
            redis_client,
        };

        let app = create_router(state);
        
        // Basic test - in production you'd use a test server
        assert!(true);
    }
}