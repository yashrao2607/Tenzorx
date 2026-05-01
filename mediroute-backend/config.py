from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "MediRoute AI API"
    DEBUG: bool = False
    VERSION: str = "2.0.0"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # API Keys
    ANTHROPIC_API_KEY: Optional[str] = None
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20240620"
    OLLAMA_MODEL: str = "llama3:8b"
    OLLAMA_TIMEOUT: int = 30

    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
