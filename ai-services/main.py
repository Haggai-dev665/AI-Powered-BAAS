import os
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

import google.generativeai as genai
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

# FastAPI app
app = FastAPI(
    title="AI-Powered BaaS - AI Services",
    description="Python AI services using Gemini API for NLP tasks",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TextAnalysisRequest(BaseModel):
    text: str = Field(..., description="Text to analyze")
    language: Optional[str] = Field("en", description="Language code")
    
class SentimentAnalysisRequest(BaseModel):
    text: str = Field(..., description="Text for sentiment analysis")
    
class TextGenerationRequest(BaseModel):
    prompt: str = Field(..., description="Text generation prompt")
    max_tokens: Optional[int] = Field(1000, description="Maximum tokens to generate")
    temperature: Optional[float] = Field(0.7, description="Generation temperature")
    
class SummarizationRequest(BaseModel):
    text: str = Field(..., description="Text to summarize")
    max_length: Optional[int] = Field(200, description="Maximum summary length")
    
class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    target_language: str = Field(..., description="Target language code")
    source_language: Optional[str] = Field("auto", description="Source language code")

class AIResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: datetime
    model_used: str
    processing_time_ms: float

class HealthStatus(BaseModel):
    status: str
    services: Dict[str, str]
    models_available: List[str]
    timestamp: datetime

# Gemini AI Service Class
class GeminiAIService:
    def __init__(self):
        self.model = None
        self.initialize_model()
    
    def initialize_model(self):
        try:
            if GEMINI_API_KEY:
                self.model = genai.GenerativeModel('gemini-pro')
                logger.info("Gemini Pro model initialized successfully")
            else:
                logger.warning("Gemini API key not available - using mock responses")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            self.model = None
    
    async def generate_text(self, prompt: str, max_tokens: int = 1000, temperature: float = 0.7) -> str:
        if not self.model:
            return f"Mock response for prompt: {prompt[:50]}..."
        
        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            return response.text
        except Exception as e:
            logger.error(f"Text generation error: {e}")
            raise HTTPException(status_code=500, detail=f"Text generation failed: {str(e)}")
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the sentiment of the following text and provide a JSON response with:
        - sentiment: positive/negative/neutral
        - confidence: float between 0 and 1
        - emotions: list of detected emotions
        
        Text: "{text}"
        
        Respond only with valid JSON.
        """
        
        if not self.model:
            return {
                "sentiment": "positive",
                "confidence": 0.85,
                "emotions": ["joy", "excitement"],
                "mock": True
            }
        
        try:
            response = await self.generate_text(prompt)
            # In production, you'd parse the JSON response properly
            return {
                "sentiment": "positive" if "positive" in response.lower() else "neutral",
                "confidence": 0.85,
                "emotions": ["determined from gemini"],
                "raw_response": response
            }
        except Exception as e:
            logger.error(f"Sentiment analysis error: {e}")
            raise HTTPException(status_code=500, detail=f"Sentiment analysis failed: {str(e)}")
    
    async def summarize_text(self, text: str, max_length: int = 200) -> str:
        prompt = f"""
        Summarize the following text in approximately {max_length} characters:
        
        {text}
        
        Provide a concise, informative summary.
        """
        
        if not self.model:
            return f"Mock summary of text (length: {len(text)} chars)"
        
        try:
            return await self.generate_text(prompt, max_tokens=max_length//4)
        except Exception as e:
            logger.error(f"Summarization error: {e}")
            raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")
    
    async def translate_text(self, text: str, target_language: str, source_language: str = "auto") -> str:
        prompt = f"""
        Translate the following text from {source_language} to {target_language}:
        
        {text}
        
        Provide only the translation, no explanations.
        """
        
        if not self.model:
            return f"Mock translation to {target_language}: {text}"
        
        try:
            return await self.generate_text(prompt)
        except Exception as e:
            logger.error(f"Translation error: {e}")
            raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

# Initialize AI service
ai_service = GeminiAIService()

# API Routes
@app.get("/", response_model=AIResponse)
async def root():
    return AIResponse(
        success=True,
        data={"message": "AI-Powered BaaS - Python AI Services with Gemini API"},
        timestamp=datetime.utcnow(),
        model_used="gemini-pro",
        processing_time_ms=1.0
    )

@app.get("/health", response_model=HealthStatus)
async def health_check():
    services = {
        "gemini_api": "healthy" if GEMINI_API_KEY else "unavailable",
        "fastapi": "healthy",
        "python_runtime": "healthy"
    }
    
    models = ["gemini-pro"] if GEMINI_API_KEY else ["mock-model"]
    
    return HealthStatus(
        status="healthy",
        services=services,
        models_available=models,
        timestamp=datetime.utcnow()
    )

@app.post("/ai/text/generate", response_model=AIResponse)
async def generate_text(request: TextGenerationRequest):
    start_time = datetime.utcnow()
    
    try:
        result = await ai_service.generate_text(
            prompt=request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        return AIResponse(
            success=True,
            data={"generated_text": result, "prompt": request.prompt},
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=processing_time
        )
    except Exception as e:
        return AIResponse(
            success=False,
            error=str(e),
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
        )

@app.post("/ai/sentiment", response_model=AIResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    start_time = datetime.utcnow()
    
    try:
        result = await ai_service.analyze_sentiment(request.text)
        
        processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        return AIResponse(
            success=True,
            data=result,
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=processing_time
        )
    except Exception as e:
        return AIResponse(
            success=False,
            error=str(e),
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
        )

@app.post("/ai/summarize", response_model=AIResponse)
async def summarize_text(request: SummarizationRequest):
    start_time = datetime.utcnow()
    
    try:
        result = await ai_service.summarize_text(request.text, request.max_length)
        
        processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        return AIResponse(
            success=True,
            data={"summary": result, "original_length": len(request.text)},
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=processing_time
        )
    except Exception as e:
        return AIResponse(
            success=False,
            error=str(e),
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
        )

@app.post("/ai/translate", response_model=AIResponse)
async def translate_text(request: TranslationRequest):
    start_time = datetime.utcnow()
    
    try:
        result = await ai_service.translate_text(
            text=request.text,
            target_language=request.target_language,
            source_language=request.source_language
        )
        
        processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        return AIResponse(
            success=True,
            data={
                "translated_text": result,
                "source_language": request.source_language,
                "target_language": request.target_language
            },
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=processing_time
        )
    except Exception as e:
        return AIResponse(
            success=False,
            error=str(e),
            timestamp=datetime.utcnow(),
            model_used="gemini-pro",
            processing_time_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
        )

@app.get("/ai/models", response_model=AIResponse)
async def list_models():
    models = [
        {
            "id": "gemini-pro",
            "name": "Gemini Pro",
            "provider": "Google",
            "capabilities": [
                "text-generation",
                "chat",
                "summarization",
                "translation",
                "sentiment-analysis"
            ],
            "status": "available" if GEMINI_API_KEY else "unavailable"
        }
    ]
    
    return AIResponse(
        success=True,
        data={"models": models, "total": len(models)},
        timestamp=datetime.utcnow(),
        model_used="system",
        processing_time_ms=1.0
    )

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    
    logger.info(f"🤖 Starting AI Services on port {port}")
    logger.info(f"🔑 Gemini API configured: {bool(GEMINI_API_KEY)}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )