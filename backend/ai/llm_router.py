from fastapi import APIRouter, Depends, HTTPException
from .llm_schemas import ImproveTextRequest
from .llm_service import improve_text_with_ai
from core.dependencies import get_current_user
from user.user_model import User

router = APIRouter()


@router.post("/improve-text")
async def improve_text(request: ImproveTextRequest, current_user: User = Depends(get_current_user)):
    try:
        improved = improve_text_with_ai(request.text, request.type)

        return {
            "original_text": request.text,
            "improved_text": improved,
            "type": request.type,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
