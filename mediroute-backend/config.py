from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Optional

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "MediRoute AI API"
    DEBUG: bool = False
    VERSION: str = "2.0.0"
    PORT: int = 8001
    HOST: str = "0.0.0.0"

    # API Keys
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    ANTHROPIC_API_KEY: Optional[str] = None
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20240620"
    OLLAMA_MODEL: str = "llama3:8b"
    API_TIMEOUT: int = 30

    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]
    DATABASE_URL: str = "sqlite:///./mediroute.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_flag(cls, value):
        if isinstance(value, bool):
            return value
        if value is None:
            return False
        normalized = str(value).strip().lower()
        return normalized in {"1", "true", "yes", "on", "debug", "dev", "development"}

settings = Settings()
