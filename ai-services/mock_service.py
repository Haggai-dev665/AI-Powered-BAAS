#!/usr/bin/env python3
"""
Mock AI Service for demonstration
"""
import json
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI-Powered BaaS - AI Services (Mock)",
    description="Mock Python AI services for demonstration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "success": True,
        "data": {"message": "AI-Powered BaaS - Mock AI Services"},
        "timestamp": datetime.utcnow().isoformat(),
        "model_used": "mock",
        "processing_time_ms": 1.0
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "services": {
            "gemini_api": "mock",
            "fastapi": "healthy",
            "python_runtime": "healthy"
        },
        "models_available": ["mock-gemini"],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/ai/text/generate")
async def generate_text(request: dict):
    return {
        "success": True,
        "data": {
            "generated_text": f"Mock response for: {request.get('prompt', '')[:50]}...",
            "prompt": request.get('prompt', '')
        },
        "timestamp": datetime.utcnow().isoformat(),
        "model_used": "mock-gemini",
        "processing_time_ms": 150.0
    }

@app.post("/ai/sentiment")
async def sentiment(request: dict):
    text = request.get('text', '')
    sentiment = "positive" if any(word in text.lower() for word in ['good', 'great', 'excellent', 'love', 'amazing']) else "negative"
    
    return {
        "success": True,
        "data": {
            "sentiment": sentiment,
            "confidence": 0.85,
            "emotions": ["joy" if sentiment == "positive" else "sadness"]
        },
        "timestamp": datetime.utcnow().isoformat(),
        "model_used": "mock-gemini",
        "processing_time_ms": 120.0
    }

@app.post("/ai/summarize")
async def summarize(request: dict):
    text = request.get('text', '')
    return {
        "success": True,
        "data": {
            "summary": f"Mock summary of {len(text)} character text",
            "original_length": len(text)
        },
        "timestamp": datetime.utcnow().isoformat(),
        "model_used": "mock-gemini",
        "processing_time_ms": 180.0
    }

@app.post("/ai/translate")
async def translate(request: dict):
    text = request.get('text', '')
    target_lang = request.get('target_language', 'es')
    
    return {
        "success": True,
        "data": {
            "translated_text": f"[MOCK TRANSLATION to {target_lang}]: {text}",
            "source_language": request.get('source_language', 'auto'),
            "target_language": target_lang
        },
        "timestamp": datetime.utcnow().isoformat(),
        "model_used": "mock-gemini",
        "processing_time_ms": 200.0
    }

@app.get("/ai/models")
async def models():
    return {
        "success": True,
        "data": {
            "models": [
                {
                    "id": "mock-gemini",
                    "name": "Mock Gemini Pro",
                    "provider": "Mock",
                    "capabilities": ["text-generation", "sentiment-analysis", "summarization", "translation"],
                    "status": "available"
                }
            ],
            "total": 1
        },
        "timestamp": datetime.utcnow().isoformat(),
        "model_used": "system",
        "processing_time_ms": 1.0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)