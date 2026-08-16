import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const API_BASE_URL = "http://127.0.0.1:8000"

function Analysis() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [process, setProcess] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const [error, setError] = useState("")
  const [analysisError, setAnalysisError] = useState("")

  // ---------------------------------------------------------
  // LOAD PROCESS
  // ---------------------------------------------------------

  useEffect(() => {
    const loadProcess = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/processes/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail || "Process not found"
          )
        }

        setProcess(data)
      } catch (err) {
        console.error("PROCESS LOAD ERROR:", err)

        setError(
          err.message || "Could not load process"
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProcess()
    }
  }, [id])


  // ---------------------------------------------------------
  // LOAD EXISTING AI ANALYSIS
  // ---------------------------------------------------------

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/analyses/process/${id}`
        )

        // 404 simply means analysis has not been generated yet.
        if (response.status === 404) {
          setAnalysis(null)
          return
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail || "Could not load analysis"
          )
        }

        setAnalysis(data)
      } catch (err) {
        console.error("ANALYSIS LOAD ERROR:", err)

        setAnalysisError(
          err.message || "Could not load existing analysis"
        )
      }
    }

    if (id) {
      loadAnalysis()
    }
  }, [id])


  // ---------------------------------------------------------
  // GENERATE AI ANALYSIS
  // ---------------------------------------------------------

  const generateAIAnalysis = async () => {
    setGenerating(true)
    setError("")
    setAnalysisError("")

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analyses/generate/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "AI analysis failed"
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
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-slate-600">
            Loading process...
          </p>
        </div>
      </div>
    )
  }


  // ---------------------------------------------------------
  // PROCESS NOT FOUND
  // ---------------------------------------------------------

  if (!process) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-red-600">
            {error || "Process not found"}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }


  // ---------------------------------------------------------
  // PARSE AI RESPONSE
  // ---------------------------------------------------------

  let currentProcess = []
  let problems = []
  let opportunities = []
  let futureProcess = []

  if (analysis) {
    try {
      currentProcess =
        typeof analysis.current_process === "string"
          ? JSON.parse(analysis.current_process || "[]")
          : analysis.current_process || []

      problems =
        typeof analysis.problems === "string"
          ? JSON.parse(analysis.problems || "[]")
          : analysis.problems || []

      opportunities =
        typeof analysis.opportunities === "string"
          ? JSON.parse(analysis.opportunities || "[]")
          : analysis.opportunities || []

      futureProcess =
        typeof analysis.future_process === "string"
          ? JSON.parse(analysis.future_process || "[]")
          : analysis.future_process || []
    } catch (err) {
      console.error("ANALYSIS PARSING ERROR:", err)

      setAnalysisError(
        "The AI analysis data could not be displayed correctly."
      )
    }
  }


  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <p className="text-sm text-slate-500">
            {process.industry} / {process.process_name}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            AI Process Analysis
          </h1>

          <div className="mt-5 rounded-lg bg-slate-100 p-5">

            <p className="text-sm text-slate-800">
              <strong>Description:</strong>{" "}
              {process.description}
            </p>

            <p className="mt-3 text-sm text-slate-800">
              <strong>Business Objective:</strong>{" "}
              {process.objective}
            </p>

          </div>

        </div>

      </header>


      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* EXISTING ANALYSIS ERROR */}

        {analysisError && !analysis && (
          <section className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              No AI analysis has been generated for this process yet.
            </p>

          </section>
        )}


        {/* GENERATE AI ANALYSIS */}

        {!analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              AI Analysis
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Generate an AI-powered analysis of this business process.
            </p>

            <button
              onClick={generateAIAnalysis}
              disabled={generating}
              className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Generating AI Analysis..."
                : "Generate AI Analysis"}
            </button>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

          </section>

        )}


        {/* CURRENT PROCESS */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Current Process
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-3">

              {currentProcess.length > 0 ? (
                currentProcess.map((step, index) => (

                  <div
                    key={`${step}-${index}`}
                    className="flex items-center gap-3"
                  >

                    <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm">
                      {typeof step === "string"
                        ? step
                        : step.activity || step.name || JSON.stringify(step)}
                    </div>

                    {index < currentProcess.length - 1 && (
                      <span className="text-slate-400">
                        →
                      </span>
                    )}

                  </div>

                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No current process steps available.
                </p>
              )}

            </div>

          </section>

        )}


        {/* PROBLEMS */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Problems Identified
            </h2>

            <div className="mt-5 space-y-3">

              {problems.length > 0 ? (
                problems.map((item, index) => (

                  <div
                    key={`${item.activity || "problem"}-${index}`}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >

                    <div>

                      <p className="font-medium">
                        {item.activity || item.title || "Problem"}
                      </p>

                      <p className="text-sm text-slate-500">
                        {item.problem || item.description || ""}
                      </p>

                    </div>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      {item.severity || "Medium"}
                    </span>

                  </div>

                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No problems identified.
                </p>
              )}

            </div>

          </section>

        )}


        {/* AI OPPORTUNITIES */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              AI Opportunities
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              {opportunities.length > 0 ? (
                opportunities.map((item, index) => (

                  <div
                    key={`${item.title || "opportunity"}-${index}`}
                    className="rounded-lg border p-5"
                  >

                    <h3 className="font-semibold">
                      {item.title || "AI Opportunity"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.description || ""}
                    </p>

                  </div>

                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No AI opportunities available.
                </p>
              )}

            </div>

          </section>

        )}


        {/* FUTURE PROCESS */}

        {analysis && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Future Process
            </h2>

            <div className="mt-5 space-y-3">

              {futureProcess.length > 0 ? (
                futureProcess.map((item, index) => (

                  <div
                    key={`${item.activity || "step"}-${index}`}
                    className="flex items-center gap-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                      {index + 1}
                    </div>

                    <div className="flex flex-1 items-center justify-between rounded-lg border p-4">

                      <span className="font-medium">
                        {item.activity || item.name || "Process step"}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {item.responsibility || "AI / Human"}
                      </span>

                    </div>

                  </div>

                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No future process available.
                </p>
              )}

            </div>

          </section>

        )}


        {/* GENERATION ERROR */}

        {error && analysis && (

          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>

        )}


        {/* ACTIONS */}

        <div className="flex gap-3 pb-8">

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
          >
            Back to Dashboard
          </button>

          {analysis && (

            <button
              onClick={() =>
                navigate(`/process/${id}/compare`)
              }
              className="rounded-lg border bg-white px-5 py-3 font-medium"
            >
              Compare
            </button>
          )}

          {analysis && (
              <button
                onClick={generateAIAnalysis}
                disabled={generating}
                className="rounded-lg border bg-white px-5 py-3 font-medium disabled:opacity-50"
              >
                {generating ? "Regenerating..." : "Regenerate AI Analysis"}
              </button>
            )}

        </div>

      </main>

    </div>
  )
}

export default Analysis