import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://ai-future-process-designer-ixxx.onrender.com"
).replace(/\/$/, "")

function parseJsonField(value, fallback = []) {
  if (Array.isArray(value)) {
    return value
  }

  if (!value) {
    return fallback
  }

  if (typeof value === "object") {
    return value
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    console.error("JSON parsing error:", error)
    return fallback
  }
}

function Comparison() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [process, setProcess] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("Process ID is missing.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        // --------------------------------------------------
        // LOAD PROCESS
        // --------------------------------------------------

        const processResponse = await fetch(
          `${API_URL}/api/processes/${id}`
        )

        if (!processResponse.ok) {
          let message = "Process not found."

          try {
            const errorData = await processResponse.json()
            message =
              errorData.detail ||
              errorData.message ||
              message
          } catch {
            // Ignore JSON parsing error
          }

          throw new Error(message)
        }

        const processData = await processResponse.json()

        setProcess(processData)

        // --------------------------------------------------
        // LOAD ANALYSIS
        // --------------------------------------------------

        const analysisResponse = await fetch(
          `${API_URL}/api/analyses/process/${id}`
        )

        if (!analysisResponse.ok) {
          let message = "Analysis not found."

          try {
            const errorData = await analysisResponse.json()
            message =
              errorData.detail ||
              errorData.message ||
              message
          } catch {
            // Ignore JSON parsing error
          }

          throw new Error(message)
        }

        const analysisData = await analysisResponse.json()

        if (!analysisData) {
          throw new Error("Analysis data is empty.")
        }

        setAnalysis(analysisData)

      } catch (err) {
        console.error("COMPARISON ERROR:", err)

        setError(
          err.message ||
          "Could not load comparison data."
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])


  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-600">
            Loading comparison...
          </p>

        </div>

      </div>
    )
  }


  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !process || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-lg font-semibold text-red-600">
            {error || "Could not load comparison."}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please return to the analysis page and try again.
          </p>

          <button
            onClick={() => navigate(`/process/${id}`)}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to Analysis
          </button>

        </div>

      </div>
    )
  }


  // --------------------------------------------------
  // PARSE ANALYSIS DATA
  // --------------------------------------------------

  const currentProcess = parseJsonField(
    analysis.current_process,
    []
  )

  const futureProcess = parseJsonField(
    analysis.future_process,
    []
  )

  const opportunities = parseJsonField(
    analysis.opportunities,
    []
  )

  const problems = parseJsonField(
    analysis.problems,
    []  
  )


  // --------------------------------------------------
  // CREATE COMPARISON ROWS
  // --------------------------------------------------

  const maxRows = Math.max(
    currentProcess.length,
    futureProcess.length,
    opportunities.length
  )

  const comparisonRows = Array.from(
    { length: maxRows },
    (_, index) => {

      const currentStep =
        currentProcess[index]

      const futureStep =
        futureProcess[index]

      const opportunity =
        opportunities[index]

      let currentText = ""

      if (typeof currentStep === "string") {
        currentText = currentStep
      } else if (currentStep?.activity) {
        currentText = currentStep.activity
      } else if (currentStep?.title) {
        currentText = currentStep.title
      } else {
        currentText = "Current process activity"
      }


      let futureText = ""

      if (typeof futureStep === "string") {
        futureText = futureStep
      } else if (futureStep?.activity) {
        futureText = futureStep.activity
      } else if (futureStep?.title) {
        futureText = futureStep.title
      } else {
        futureText = "Future-state activity"
      }


      let transitionText = ""

      if (typeof opportunity === "string") {
        transitionText = opportunity
      } else if (opportunity?.title) {
        transitionText = opportunity.title
      } else {
        transitionText = "AI-enabled improvement"
      }


      const responsibility =
        futureStep?.responsibility ||
        "AI"


      return {
        current: currentText,
        transition: transitionText,
        future: futureText,
        responsibility,
      }
    }
  )


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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
            {process.industry || "Business"}{" "}
            /{" "}
            {process.process_name || "Process"}
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

        <section className="grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current Steps
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {currentProcess.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Existing process activities
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Problems
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {problems.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Issues identified by AI
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              AI Opportunities
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {opportunities.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Transformation opportunities
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Future Steps
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {futureProcess.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              AI-enabled activities
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

                {/* CURRENT */}

                <div className="p-5">

                  <div className="mb-2 text-xs font-semibold text-slate-400">
                    STEP {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {item.current}
                  </p>

                </div>


                {/* TRANSITION */}

                <div className="border-x p-5">

                  <div className="mb-2 text-xs font-semibold text-slate-400">
                    AI TRANSFORMATION
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {item.transition}
                  </p>

                </div>


                {/* FUTURE */}

                <div className="p-5">

                  <div className="mb-2 text-xs font-semibold text-slate-400">
                    FUTURE STATE
                  </div>

                  <p className="text-sm font-medium leading-6 text-slate-900">
                    {item.future}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {item.responsibility}
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="p-8 text-center">

              <p className="text-sm text-slate-500">
                No comparison data available.
              </p>

            </div>

          )}

        </section>


        {/* PROBLEMS */}

        {problems.length > 0 && (

          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Current Process Problems
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Problems identified in the existing process.
            </p>


            <div className="mt-5 space-y-3">

              {problems.map((item, index) => {

                const activity =
                  item?.activity ||
                  "Process activity"

                const problem =
                  item?.problem ||
                  "Process problem identified."

                const severity =
                  item?.severity ||
                  "Medium"


                return (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 p-5"
                  >

                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          {activity}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {problem}
                        </p>

                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {severity}
                      </span>

                    </div>

                  </div>
                )
              })}

            </div>

          </section>

        )}


        {/* AI OPPORTUNITIES */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            AI Transformation Opportunities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Key opportunities identified by the AI analysis.
          </p>


          {opportunities.length > 0 ? (

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {opportunities.map((item, index) => (

                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-5"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white">
                    {index + 1}
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {item?.title ||
                      "AI Transformation Opportunity"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item?.description ||
                      "AI can improve this part of the process."}
                  </p>

                </div>

              ))}

            </div>

          ) : (

            <div className="mt-5 rounded-lg border border-slate-200 p-6 text-center">

              <p className="text-sm text-slate-500">
                No AI opportunities were returned.
              </p>

            </div>

          )}

        </section>


        {/* FUTURE PROCESS */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Future-State Process
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The proposed AI-enabled process after transformation.
          </p>


          {futureProcess.length > 0 ? (

            <div className="mt-5 space-y-3">

              {futureProcess.map((item, index) => (

                <div
                  key={index}
                  className="flex gap-4 rounded-lg border border-slate-200 p-4"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-900">
                      {item?.activity ||
                        item?.title ||
                        "Future-state activity"}
                    </p>

                    {item?.responsibility && (

                      <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {item.responsibility}
                      </span>

                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="mt-5 rounded-lg border border-slate-200 p-6 text-center">

              <p className="text-sm text-slate-500">
                No future-state process was returned.
              </p>

            </div>

          )}

        </section>


        {/* ACTIONS */}

        <div className="flex flex-col gap-3 pb-8 sm:flex-row">

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