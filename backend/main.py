from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Process
from schemas import ProcessCreate, ProcessResponse


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Future Process Designer API"
)


@app.get("/")
def root():
    return {
        "message": "AI Future Process Designer API is running"
    }


@app.post(
    "/api/processes",
    response_model=ProcessResponse
)
def create_process(
    process: ProcessCreate,
    db: Session = Depends(get_db)
):
    new_process = Process(
        industry=process.industry,
        process_name=process.process_name,
        description=process.description,
        objective=process.objective
    )

    db.add(new_process)
    db.commit()
    db.refresh(new_process)

    return new_process


@app.get(
    "/api/processes",
    response_model=list[ProcessResponse]
)
def get_processes(
    db: Session = Depends(get_db)
):
    return db.query(Process).all()


@app.get(
    "/api/processes/{process_id}",
    response_model=ProcessResponse
)
def get_process(
    process_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Process).filter(
        Process.id == process_id
    ).first()