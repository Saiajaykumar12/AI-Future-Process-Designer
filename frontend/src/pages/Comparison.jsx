import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

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
        setError("")

        const processResponse = await fetch(
          `http://127.0.0.1:8000/api/processes/${id}`
        )

        if (!processResponse.ok) {
          throw new Error("Process not found")
        }

        const processData = await processResponse.json()
        setProcess(processData)

        const analysisResponse = await fetch(
          `http://127.0.0.1:8000/api/analyses/process/${id}`
        )

        if (!analysisResponse.ok) {
          throw new Error("Analysis not found")
        }

        const analysisData = await analysisResponse.json()
        setAnalysis(analysisData)

      } catch (err) {
        console.error("COMPARISON ERROR:", err)
        setError(err.message)
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


  if (error || !process || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-red-600">
            {error || "Could not load comparison."}
          </p>

          <button
            onClick={() => navigate(`/process/${id}`)}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Back to Analysis
          </button>

        </div>

      </div>
    )
  }


  let currentProcess = []
  let futureProcess = []
  let opportunities = []

  try {
    currentProcess = JSON.parse(
      analysis.current_process || "[]"
    )

    futureProcess = JSON.parse(
      analysis.future_process || "[]"
    )

    opportunities = JSON.parse(
      analysis.opportunities || "[]"
    )
  } catch (err) {
    console.error("Comparison parsing error:", err)
  }


  const comparisonRows = currentProcess.map(
    (currentStep, index) => {

      const futureStep = futureProcess[index]

      const opportunity = opportunities[index]

      return {
        current: currentStep,
        transition: opportunity
          ? opportunity.title
          : "AI-enabled improvement",
        future: futureStep
          ? futureStep.activity
          : "Future-state activity",
        responsibility: futureStep
          ? futureStep.responsibility
          : "AI",
      }
    }
  )


  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <button
            onClick={() => navigate(`/process/${id}`)}
            className="mb-4 text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to Analysis
          </button>

          <p className="text-sm text-slate-500">
            {process.industry} / {process.process_name}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Current → Transition → Future
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Compare the existing process with the AI-enabled future state.
          </p>

        </div>

      </header>


      {/* MAIN */}

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">


        {/* SUMMARY */}

        <section className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current Steps
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {currentProcess.length}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              AI Opportunities
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {opportunities.length}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Future Steps
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {futureProcess.length}
            </p>

          </div>

        </section>


        {/* COMPARISON TABLE */}

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="grid grid-cols-3 border-b">

            <div className="bg-slate-100 p-5 font-semibold text-slate-700">
              CURRENT
            </div>

            <div className="bg-slate-100 p-5 font-semibold text-slate-700">
              TRANSITION
            </div>

            <div className="bg-slate-100 p-5 font-semibold text-slate-700">
              FUTURE
            </div>

          </div>


          {comparisonRows.length > 0 ? (

            comparisonRows.map((item, index) => (

              <div
                key={index}
                className="grid grid-cols-3 border-b last:border-b-0"
              >

                <div className="p-5">

                  <p className="text-sm text-slate-700">
                    {item.current}
                  </p>

                </div>


                <div className="border-x p-5">

                  <p className="text-sm text-slate-600">
                    {item.transition}
                  </p>

                </div>


                <div className="p-5">

                  <p className="text-sm font-medium text-slate-900">
                    {item.future}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {item.responsibility}
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="p-8 text-center text-sm text-slate-500">
              No comparison data available.
            </div>

          )}

        </section>


        {/* AI OPPORTUNITIES */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            AI Transformation Opportunities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Key opportunities identified by the AI analysis.
          </p>


          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {opportunities.map((item, index) => (

              <div
                key={index}
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

            ))}

          </div>

        </section>


        {/* ACTIONS */}

        <div className="flex gap-3 pb-8">

          <button
            onClick={() => navigate(`/process/${id}`)}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to Analysis
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Dashboard
          </button>

        </div>

      </main>

    </div>
  )
}

export default Comparison