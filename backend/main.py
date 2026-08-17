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


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Future Process Designer API",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    # Local development
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Vercel production frontend
        "https://ai-future-process-designer-three.vercel.app",
    ],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "AI Future Process Designer API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# =========================================================
# CREATE PROCESS
# =========================================================

@app.post(
    "/api/processes",
    response_model=ProcessResponse
)
def create_process(
    process: ProcessCreate,
    db: Session = Depends(get_db)
):
    try:
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

    except Exception as e:
        db.rollback()

        print("CREATE PROCESS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Could not create process: {str(e)}"
        )


# =========================================================
# GET ALL PROCESSES
# =========================================================

@app.get(
    "/api/processes",
    response_model=list[ProcessResponse]
)
def get_processes(
    db: Session = Depends(get_db)
):
    try:
        processes = (
            db.query(Process)
            .order_by(Process.id.desc())
            .all()
        )

        return processes

    except Exception as e:
        print("GET PROCESSES ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Could not load processes: {str(e)}"
        )


# =========================================================
# GET SINGLE PROCESS
# =========================================================

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


# =========================================================
# GENERATE AI ANALYSIS
# =========================================================

@app.post(
    "/api/analyses/generate/{process_id}",
    response_model=AnalysisResponse
)
def generate_analysis(
    process_id: int,
    db: Session = Depends(get_db)
):
    # -----------------------------------------------------
    # Find process
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Generate AI result
    # -----------------------------------------------------

    try:
        ai_result = generate_process_analysis(
            industry=process.industry,
            process_name=process.process_name,
            description=process.description,
            objective=process.objective,
        )

        print("RAW AI RESULT:")
        print(ai_result)

    except Exception as e:
        print("AI SERVICE ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # -----------------------------------------------------
    # Parse AI JSON
    # -----------------------------------------------------

    try:
        # Handle possible markdown code fences
        cleaned_result = ai_result.strip()

        if cleaned_result.startswith("```json"):
            cleaned_result = cleaned_result[7:]

        elif cleaned_result.startswith("```"):
            cleaned_result = cleaned_result[3:]

        if cleaned_result.endswith("```"):
            cleaned_result = cleaned_result[:-3]

        cleaned_result = cleaned_result.strip()

        result = json.loads(cleaned_result)

    except json.JSONDecodeError as e:
        print("AI JSON ERROR:", e)
        print("INVALID AI RESPONSE:")
        print(ai_result)

        raise HTTPException(
            status_code=500,
            detail="AI returned invalid JSON"
        )

    # -----------------------------------------------------
    # Extract expected fields
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Save analysis
    # -----------------------------------------------------

    try:
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

    except Exception as e:
        db.rollback()

        print("SAVE ANALYSIS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Could not save analysis: {str(e)}"
        )


# =========================================================
# CREATE ANALYSIS MANUALLY
# =========================================================

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

    try:
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

    except Exception as e:
        db.rollback()

        print("CREATE ANALYSIS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Could not create analysis: {str(e)}"
        )


# =========================================================
# GET LATEST ANALYSIS FOR PROCESS
# =========================================================

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
        .filter(
            Analysis.process_id == process_id
        )
        .order_by(
            Analysis.id.desc()
        )
        .first()
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return analysis