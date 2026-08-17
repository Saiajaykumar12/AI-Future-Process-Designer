from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import json

from database import Base, engine, get_db
from models import Process, Analysis
from schemas import (
    ProcessCreate,
    ProcessResponse,
    AnalysisCreate,
    AnalysisResponse,
)

from ai_service import generate_process_analysis


# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------

Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# APP
# ---------------------------------------------------------

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
        "https://ai-future-process-designer-three.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Future Process Designer API is running"
    }


# ---------------------------------------------------------
# CREATE PROCESS
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
        objective=process.objective,
        status="Pending",
    )

    db.add(new_process)
    db.commit()
    db.refresh(new_process)

    return new_process


# ---------------------------------------------------------
# GET ALL PROCESSES
# ---------------------------------------------------------

@app.get(
    "/api/processes",
    response_model=list[ProcessResponse]
)
def get_processes(
    db: Session = Depends(get_db)
):
    return (
        db.query(Process)
        .order_by(Process.id.desc())
        .all()
    )


# ---------------------------------------------------------
# GET SINGLE PROCESS
# ---------------------------------------------------------

@app.get(
    "/api/processes/{process_id}",
    response_model=ProcessResponse
)
def get_process(
    process_id: int,
    db: Session = Depends(get_db)
):
    process = (
        db.query(Process)
        .filter(Process.id == process_id)
        .first()
    )

    if process is None:
        raise HTTPException(
            status_code=404,
            detail="Process not found"
        )

    return process


# ---------------------------------------------------------
# GENERATE AI ANALYSIS
# ---------------------------------------------------------

@app.post(
    "/api/analyses/generate/{process_id}",
    response_model=AnalysisResponse
)
def generate_analysis(
    process_id: int,
    db: Session = Depends(get_db)
):
    process = (
        db.query(Process)
        .filter(Process.id == process_id)
        .first()
    )

    if process is None:
        raise HTTPException(
            status_code=404,
            detail="Process not found"
        )

    try:
        ai_result = generate_process_analysis(
            industry=process.industry,
            process_name=process.process_name,
            description=process.description,
            objective=process.objective,
        )

        result = json.loads(ai_result)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid JSON"
        )

    except Exception as e:
        print("AI ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # Make sure all expected fields exist
    current_process = result.get(
        "current_process",
        []
    )

    problems = result.get(
        "problems",
        []
    )

    opportunities = result.get(
        "opportunities",
        []
    )

    future_process = result.get(
        "future_process",
        []
    )

    # Save analysis
    new_analysis = Analysis(
        process_id=process.id,

        current_process=json.dumps(
            current_process
        ),

        problems=json.dumps(
            problems
        ),

        opportunities=json.dumps(
            opportunities
        ),

        future_process=json.dumps(
            future_process
        ),
    )

    db.add(new_analysis)

    # Update process status
    process.status = "Analysed"

    db.commit()
    db.refresh(new_analysis)

    return new_analysis


# ---------------------------------------------------------
# CREATE ANALYSIS MANUALLY
# ---------------------------------------------------------

@app.post(
    "/api/analyses",
    response_model=AnalysisResponse
)
def create_analysis(
    analysis: AnalysisCreate,
    db: Session = Depends(get_db)
):
    process = (
        db.query(Process)
        .filter(Process.id == analysis.process_id)
        .first()
    )

    if process is None:
        raise HTTPException(
            status_code=404,
            detail="Process not found"
        )

    new_analysis = Analysis(
        process_id=analysis.process_id,
        current_process=analysis.current_process,
        problems=analysis.problems,
        opportunities=analysis.opportunities,
        future_process=analysis.future_process,
    )

    db.add(new_analysis)

    process.status = "Analysed"

    db.commit()
    db.refresh(new_analysis)

    return new_analysis


# ---------------------------------------------------------
# GET LATEST ANALYSIS FOR PROCESS
# ---------------------------------------------------------

@app.get(
    "/api/analyses/process/{process_id}",
    response_model=AnalysisResponse
)
def get_analysis(
    process_id: int,
    db: Session = Depends(get_db)
):
    analysis = (
        db.query(Analysis)
        .filter(Analysis.process_id == process_id)
        .order_by(Analysis.id.desc())
        .first()
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return analysis