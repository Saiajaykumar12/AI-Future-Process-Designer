import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const API_BASE_URL = "http://127.0.0.1:8000"

function Comparison() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [process, setProcess] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const processResponse = await fetch(
          `${API_BASE_URL}/api/processes/${id}`
        )

        const processData = await processResponse.json()

        if (!processResponse.ok) {
          throw new Error(
            processData.detail || "Could not load process"
          )
        }

        setProcess(processData)

        const analysisResponse = await fetch(
          `${API_BASE_URL}/api/analyses/process/${id}`
        )

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json()
          setAnalysis(analysisData)
        }

      } catch (err) {
        console.error("COMPARISON ERROR:", err)
        setError(err.message || "Could not load comparison")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Loading comparison...
        </p>
      </div>
    )
  }


  if (error || !process) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white p-8 shadow-sm">

          <p className="text-red-600">
            {error || "Process not found"}
          </p>

          <button
            onClick={() => navigate(`/process/${id}`)}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
          >
            Back to Analysis
          </button>

        </div>
      </div>
    )
  }


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
      console.error("Comparison parsing error:", err)
    }
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <p className="text-sm text-slate-500">
            {process.industry} / {process.process_name}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Current → Transition → Future
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Compare the existing business process with the AI-powered future process.
          </p>

        </div>

      </header>


      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* COMPARISON TABLE */}

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="grid grid-cols-3 border-b">

            <div className="bg-slate-100 p-5 font-semibold">
              CURRENT
            </div>

            <div className="bg-slate-100 p-5 font-semibold">
              TRANSITION
            </div>

            <div className="bg-slate-100 p-5 font-semibold">
              FUTURE
            </div>

          </div>


          {futureProcess.length > 0 ? (

            futureProcess.map((future, index) => {

              const current =
                currentProcess[index] ||
                "Existing process activity"

              const opportunity =
                opportunities[index]

              const transition =
                opportunity?.title
                  ? `Introduce ${opportunity.title}`
                  : "Introduce AI assistance"

              const currentText =
                typeof current === "string"
                  ? current
                  : current.activity ||
                    current.name ||
                    "Current activity"

              const futureText =
                typeof future === "string"
                  ? future
                  : future.activity ||
                    future.name ||
                    "Future activity"

              return (
                <div
                  key={index}
                  className="grid grid-cols-3 border-b last:border-b-0"
                >

                  <div className="p-5 text-sm">
                    {currentText}
                  </div>

                  <div className="border-x p-5 text-sm text-slate-600">
                    {transition}
                  </div>

                  <div className="p-5 text-sm font-medium">
                    {futureText}
                  </div>

                </div>
              )
            })

          ) : (

            <div className="p-8 text-center text-sm text-slate-500">
              No AI comparison data available yet.
            </div>

          )}

        </section>


        {/* PROBLEMS */}

        {problems.length > 0 && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Problems Addressed
            </h2>

            <div className="mt-5 space-y-3">

              {problems.map((item, index) => (

                <div
                  key={index}
                  className="rounded-lg border p-4"
                >

                  <div className="flex items-center justify-between">

                    <p className="font-medium">
                      {item.activity || "Process activity"}
                    </p>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      {item.severity || "Medium"}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.problem || item.description}
                  </p>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* AI OPPORTUNITIES */}

        {opportunities.length > 0 && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              AI Transformation Opportunities
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              {opportunities.map((item, index) => (

                <div
                  key={index}
                  className="rounded-lg border p-5"
                >

                  <h3 className="font-semibold">
                    {item.title || "AI Opportunity"}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.description || ""}
                  </p>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* PROCESS RESPONSIBILITIES */}

        {futureProcess.length > 0 && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Future Process Responsibilities
            </h2>

            <div className="mt-5 space-y-3">

              {futureProcess.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                    {index + 1}
                  </div>

                  <div className="flex flex-1 items-center justify-between rounded-lg border p-4">

                    <span className="font-medium">
                      {item.activity ||
                        item.name ||
                        "Process activity"}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                      {item.responsibility ||
                        "AI / Human"}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* ACTIONS */}

        <div className="flex gap-3 pb-8">

          <button
            onClick={() => navigate(`/process/${id}`)}
            className="rounded-lg border bg-white px-5 py-3 font-medium"
          >
            Back to Analysis
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
          >
            Dashboard
          </button>

        </div>

      </main>

    </div>
  )
}

export default Comparison