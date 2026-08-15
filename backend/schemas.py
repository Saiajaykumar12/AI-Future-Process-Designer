from pydantic import BaseModel


class ProcessCreate(BaseModel):
    industry: str
    process_name: str
    description: str
    objective: str


class ProcessResponse(BaseModel):
    id: int
    industry: str
    process_name: str
    description: str
    objective: str
    status: str

    class Config:
        from_attributes = True