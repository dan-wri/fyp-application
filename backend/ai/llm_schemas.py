from pydantic import BaseModel


class ImproveTextRequest(BaseModel):
    text: str
    type: str
