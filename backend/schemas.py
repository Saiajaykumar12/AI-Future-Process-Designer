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


class AnalysisCreate(BaseModel):
    process_id: int
    current_process: str
    problems: str
    opportunities: str
    future_process: str


class AnalysisResponse(BaseModel):
    id: int
    process_id: int
    current_process: str
    problems: str
    opportunities: str
    future_process: str

    class Config:
        from_attributes = True