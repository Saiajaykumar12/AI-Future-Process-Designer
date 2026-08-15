from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Process
from schemas import ProcessCreate, ProcessResponse


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Future Process Designer API"
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Root
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Future Process Designer API is running"
    }


# ---------------------------------------------------------
# Create Process
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# Get All Processes
# ---------------------------------------------------------

@app.get(
    "/api/processes",
    response_model=list[ProcessResponse]
)
def get_processes(
    db: Session = Depends(get_db)
):

    return db.query(Process).all()


# ---------------------------------------------------------
# Get One Process
# ---------------------------------------------------------

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