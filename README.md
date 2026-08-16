# AI Future Process Designer

An AI-powered business process transformation application that analyses existing business processes and designs practical AI-enabled future-state processes.

## Project Overview

The AI Future Process Designer helps organisations understand their current business processes, identify operational problems, discover opportunities for AI adoption, and design improved future-state processes.

The application uses Google's Gemini AI to analyse a business process based on its industry, process description, and business objectives.

## Key Features

- Create and store business processes
- View saved processes from the dashboard
- Analyse business processes using Gemini AI
- Identify current process steps
- Identify operational problems and their severity
- Identify practical AI opportunities
- Generate an AI-enabled future process
- Distinguish responsibilities between AI, humans, and systems
- Compare current, transition, and future states
- Export process analysis as a PDF report
- Store process and analysis data using SQLite
- REST API built with FastAPI
- React-based frontend interface

## Application Workflow

```text
Create Business Process
        ↓
Store Process in Database
        ↓
Generate AI Analysis
        ↓
Identify Current Process
        ↓
Identify Problems
        ↓
Identify AI Opportunities
        ↓
Design Future Process
        ↓
Current → Transition → Future Comparison
        ↓
Export PDF Report

Technology Stack
Frontend
React
Vite
React Router
Tailwind CSS
JavaScript


Backend
Python
FastAPI
Uvicorn
SQLAlchemy
Pydantic


Database
SQLite

Artificial Intelligence
Google Gemini API
Gemini 2.5 Flash

