import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import jsPDF from "jspdf"

function Analysis() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [process, setProcess] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  // ---------------------------------------------------------
  // Load Process
  // ---------------------------------------------------------

  useEffect(() => {
    const loadProcess = async () => {
      if (!id || id === "undefined") {
        setError("Invalid process ID.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `http://127.0.0.1:8000/api/processes/${id}`
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))

          throw new Error(
            data.detail || "Process not found"
          )
        }

        const data = await response.json()

        setProcess(data)

      } catch (err) {
        console.error("PROCESS LOAD ERROR:", err)

        setError(
          err.message || "Could not load process."
        )
      } finally {
        setLoading(false)
      }
    }

    loadProcess()
  }, [id])


  // ---------------------------------------------------------
  // Load Existing Analysis
  // ---------------------------------------------------------

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id || id === "undefined") {
        return
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/analyses/process/${id}`
        )

        if (response.ok) {
          const data = await response.json()

          setAnalysis(data)
        }

      } catch (err) {
        console.error("ANALYSIS LOAD ERROR:", err)
      }
    }

    loadAnalysis()
  }, [id])


  // ---------------------------------------------------------
  // Generate AI Analysis
  // ---------------------------------------------------------

  const generateAIAnalysis = async () => {
    if (!id || id === "undefined") {
      setError("Invalid process ID.")
      return
    }

    try {
      setGenerating(true)
      setError("")

      const response = await fetch(
        `http://127.0.0.1:8000/api/analyses/generate/${id}`,
        {
          method: "POST",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "AI analysis failed."
        )
      }

      setAnalysis(data)

    } catch (err) {
      console.error("AI ANALYSIS ERROR:", err)

      setError(
        err.message || "Could not generate AI analysis."
      )

    } finally {
      setGenerating(false)
    }
  }


  // ---------------------------------------------------------
  // Parse Analysis Data
  // ---------------------------------------------------------

  let currentProcess = []
  let problems = []
  let opportunities = []
  let futureProcess = []

  if (analysis) {
    try {
      currentProcess = JSON.parse(
        analysis.current_process || "[]"
      )

      problems = JSON.parse(
        analysis.problems || "[]"
      )

      opportunities = JSON.parse(
        analysis.opportunities || "[]"
      )

      futureProcess = JSON.parse(
        analysis.future_process || "[]"
      )

    } catch (err) {
      console.error(
        "ANALYSIS PARSING ERROR:",
        err
      )

      if (!error) {
        setError(
          "Could not read the AI analysis data."
        )
      }
    }
  }


  // ---------------------------------------------------------
  // Export PDF
  // ---------------------------------------------------------

  const exportPDF = () => {
    if (!process || !analysis) {
      return
    }

    const doc = new jsPDF()

    let y = 20

    const addPageIfNeeded = (height = 10) => {
      if (y + height > 275) {
        doc.addPage()
        y = 20
      }
    }

    // Title

    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text(
      "AI Future Process Designer",
      20,
      y
    )

    y += 12

    doc.setFontSize(16)
    doc.text(
      "AI Process Analysis Report",
      20,
      y
    )

    y += 12

    // Process information

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    doc.text(
      `Industry: ${process.industry}`,
      20,
      y
    )

    y += 7

    doc.text(
      `Process: ${process.process_name}`,
      20,
      y
    )

    y += 10

    // Description

    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")

    doc.text(
      "Process Description",
      20,
      y
    )

    y += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const descriptionLines =
      doc.splitTextToSize(
        process.description || "",
        170
      )

    doc.text(
      descriptionLines,
      20,
      y
    )

    y += descriptionLines.length * 5 + 8

    // Objective

    addPageIfNeeded(20)

    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")

    doc.text(
      "Business Objective",
      20,
      y
    )

    y += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const objectiveLines =
      doc.splitTextToSize(
        process.objective || "",
        170
      )

    doc.text(
      objectiveLines,
      20,
      y
    )

    y += objectiveLines.length * 5 + 10

    // Current Process

    addPageIfNeeded(20)

    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")

    doc.text(
      "Current Process",
      20,
      y
    )

    y += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    currentProcess.forEach(
      (step, index) => {
        addPageIfNeeded(10)

        doc.text(
          `${index + 1}. ${step}`,
          25,
          y
        )

        y += 6
      }
    )

    y += 6

    // Problems

    addPageIfNeeded(20)

    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")

    doc.text(
      "Problems Identified",
      20,
      y
    )

    y += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    problems.forEach((item) => {
      addPageIfNeeded(20)

      doc.setFont("helvetica", "bold")

      doc.text(
        `${item.activity} - ${item.severity}`,
        25,
        y
      )

      y += 5

      doc.setFont("helvetica", "normal")

      const problemLines =
        doc.splitTextToSize(
          item.problem || "",
          160
        )

      doc.text(
        problemLines,
        30,
        y
      )

      y += problemLines.length * 5 + 5
    })

    // AI Opportunities

    addPageIfNeeded(20)

    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")

    doc.text(
      "AI Opportunities",
      20,
      y
    )

    y += 7

    opportunities.forEach((item) => {
      addPageIfNeeded(20)

      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")

      doc.text(
        item.title || "AI Opportunity",
        25,
        y
      )

      y += 5

      doc.setFont("helvetica", "normal")

      const opportunityLines =
        doc.splitTextToSize(
          item.description || "",
          160
        )

      doc.text(
        opportunityLines,
        30,
        y
      )

      y += opportunityLines.length * 5 + 6
    })

    // Future Process

    addPageIfNeeded(20)

    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")

    doc.text(
      "Future Process",
      20,
      y
    )

    y += 7

    futureProcess.forEach(
      (item, index) => {
        addPageIfNeeded(15)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")

        doc.text(
          `${index + 1}. ${item.activity}`,
          25,
          y
        )

        y += 5

        doc.text(
          `Responsibility: ${item.responsibility}`,
          30,
          y
        )

        y += 7
      }
    )

    // Footer

    const pageCount =
      doc.internal.getNumberOfPages()

    for (
      let page = 1;
      page <= pageCount;
      page++
    ) {
      doc.setPage(page)

      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")

      doc.text(
        `AI Future Process Designer | Page ${page} of ${pageCount}`,
        20,
        290
      )
    }

    const fileName =
      `${process.process_name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "")
      }_AI_Analysis.pdf`

    doc.save(fileName)
  }


  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-600">
            Loading process...
          </p>

        </div>

      </div>
    )
  }


  // ---------------------------------------------------------
  // Process Not Found
  // ---------------------------------------------------------

  if (!process) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-red-600">
            {error || "Process not found."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    )
  }


  // ---------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to Dashboard
          </button>

          <p className="text-sm text-slate-500">
            {process.industry} / {process.process_name}
          </p>

          <div className="mt-1 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                AI Process Analysis
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                AI-powered analysis and future-state transformation.
              </p>

            </div>

            {analysis && (

              <button
                onClick={exportPDF}
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Export PDF
              </button>

            )}

          </div>


          {/* PROCESS DETAILS */}

          <div className="mt-5 rounded-xl bg-slate-100 p-5">

            <p className="text-sm leading-6 text-slate-800">
              <strong>Description:</strong>{" "}
              {process.description}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-800">
              <strong>Business Objective:</strong>{" "}
              {process.objective}
            </p>

          </div>

        </div>

      </header>


      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">


        {/* GENERATE AI ANALYSIS */}

        {!analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                AI
              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  AI Analysis
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Use Gemini AI to analyse this business process,
                  identify operational problems and recommend an
                  AI-enabled future state.
                </p>

              </div>

            </div>


            <button
              onClick={generateAIAnalysis}
              disabled={generating}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Generating AI Analysis..."
                : "Generate AI Analysis"}
            </button>


            {error && (

              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">

                <p className="text-sm text-red-700">
                  {error}
                </p>

              </div>

            )}

          </section>

        )}


        {/* ERROR AFTER ANALYSIS */}

        {error && analysis && (

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>

        )}


        {/* CURRENT PROCESS */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Current Process
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Process steps identified from the current-state description.
            </p>


            <div className="mt-5 flex flex-wrap items-center gap-3">

              {currentProcess.map(
                (step, index) => (

                  <div
                    key={`${step}-${index}`}
                    className="flex items-center gap-3"
                  >

                    <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {step}
                    </div>

                    {index <
                      currentProcess.length - 1 && (

                      <span className="text-slate-400">
                        →
                      </span>

                    )}

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* PROBLEMS */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Problems Identified
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Operational issues identified by the AI analysis.
            </p>


            <div className="mt-5 space-y-3">

              {problems.map(
                (item, index) => (

                  <div
                    key={`${item.activity}-${index}`}
                    className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                  >

                    <div>

                      <p className="font-medium text-slate-900">
                        {item.activity}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.problem}
                      </p>

                    </div>


                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        item.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : item.severity === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.severity}
                    </span>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* AI OPPORTUNITIES */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              AI Opportunities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Practical AI capabilities recommended for the process.
            </p>


            <div className="mt-5 grid gap-4 md:grid-cols-3">

              {opportunities.map(
                (item, index) => (

                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-lg border p-5"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white">
                      {index + 1}
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* FUTURE PROCESS */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Future Process
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Proposed AI-enabled future-state process.
            </p>


            <div className="mt-5 space-y-3">

              {futureProcess.map(
                (item, index) => (

                  <div
                    key={`${item.activity}-${index}`}
                    className="flex items-center gap-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                      {index + 1}
                    </div>


                    <div className="flex flex-1 flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">

                      <span className="font-medium text-slate-900">
                        {item.activity}
                      </span>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {item.responsibility}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* ACTIONS */}

        <div className="flex flex-col gap-3 pb-8 sm:flex-row">

          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard
          </button>


          {analysis && (

            <button
              onClick={() =>
                navigate(`/process/${id}/compare`)
              }
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Compare Current → Future
            </button>

          )}

        </div>

      </main>

    </div>
  )
}

export default Analysis