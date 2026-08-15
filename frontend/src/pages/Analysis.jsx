import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

function Analysis() {
  const { processId } = useParams()
  const navigate = useNavigate()

  const [process, setProcess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `http://127.0.0.1:8000/api/processes/${processId}`
        )

        if (!response.ok) {
          throw new Error("Process could not be found")
        }

        const data = await response.json()

        setProcess(data)
      } catch (err) {
        console.error("Error fetching process:", err)

        setError(
          "Could not load the process from the backend. Make sure your FastAPI server is running."
        )
      } finally {
        setLoading(false)
      }
    }

    if (processId) {
      fetchProcess()
    } else {
      setError("No process ID was provided.")
      setLoading(false)
    }
  }, [processId])

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="rounded-xl bg-white p-8 shadow-sm text-center">
          <p className="text-lg font-medium text-slate-900">
            Loading process...
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Fetching process information from the backend.
          </p>
        </div>
      </div>
    )
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-lg rounded-xl bg-white p-8 shadow-sm text-center">

          <h1 className="text-xl font-bold text-red-600">
            Unable to Load Process
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            {error}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    )
  }

  // -----------------------------
  // PROCESS DATA
  // -----------------------------

  const industry = process?.industry || "Unknown Industry"
  const processName = process?.process_name || "Unnamed Process"
  const description = process?.description || ""
  const objective = process?.objective || ""

  // -----------------------------
  // CURRENT PROCESS
  // -----------------------------

  const currentProcess = [
    "Receive Request",
    "Check Information",
    "Process Request",
    "Perform Checks",
    "Approve",
    "Notify Customer"
  ]

  // -----------------------------
  // PROBLEMS
  // -----------------------------

  const problems = [
    [
      "Manual processing",
      "The current process contains manual activities that can cause delays.",
      "High"
    ],
    [
      "Human errors",
      "Manual work can increase the possibility of errors.",
      "Medium"
    ],
    [
      "Process delays",
      "Manual prioritisation and checking can slow down the process.",
      "High"
    ]
  ]

  // -----------------------------
  // AI OPPORTUNITIES
  // -----------------------------

  const aiOpportunities = [
    [
      "Process Automation",
      "Automate repetitive manual activities and reduce processing time."
    ],
    [
      "Intelligent Prioritisation",
      "Use AI to identify and prioritise important or urgent tasks."
    ],
    [
      "Error Detection",
      "Use AI to identify potential errors before they affect the process."
    ]
  ]

  // -----------------------------
  // FUTURE PROCESS
  // -----------------------------

  const futureProcess = [
    ["Receive Request", "System"],
    ["Analyse Information", "AI"],
    ["Prioritise Task", "AI"],
    ["Perform Automated Checks", "AI"],
    ["Approve Exceptions", "Human"],
    ["Notify Customer", "AI"]
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <p className="text-sm text-slate-500">
            {industry} / {processName}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            AI Process Analysis
          </h1>

          <div className="mt-5 rounded-lg bg-slate-100 p-5">

            <p className="text-sm text-slate-800">
              <strong>Description:</strong>{" "}
              {description || "No description provided."}
            </p>

            <p className="mt-3 text-sm text-slate-800">
              <strong>Business Objective:</strong>{" "}
              {objective || "No business objective provided."}
            </p>

          </div>

        </div>

      </header>


      {/* -------------------------------- */}
      {/* MAIN CONTENT */}
      {/* -------------------------------- */}

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">


        {/* -------------------------------- */}
        {/* CURRENT PROCESS */}
        {/* -------------------------------- */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Current Process
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-3">

            {currentProcess.map((step, index) => (

              <div
                key={step}
                className="flex items-center gap-3"
              >

                <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                  {step}
                </div>

                {index < currentProcess.length - 1 && (
                  <span className="text-slate-400">
                    →
                  </span>
                )}

              </div>

            ))}

          </div>

        </section>


        {/* -------------------------------- */}
        {/* PROBLEMS IDENTIFIED */}
        {/* -------------------------------- */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Problems Identified
          </h2>

          <div className="mt-5 space-y-3">

            {problems.map(
              ([activity, problem, severity]) => (

                <div
                  key={activity}
                  className="flex items-center justify-between rounded-lg border border-slate-300 p-4"
                >

                  <div>

                    <p className="font-medium text-slate-900">
                      {activity}
                    </p>

                    <p className="text-sm text-slate-500">
                      {problem}
                    </p>

                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                    {severity}
                  </span>

                </div>

              )
            )}

          </div>

        </section>


        {/* -------------------------------- */}
        {/* AI OPPORTUNITIES */}
        {/* -------------------------------- */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            AI Opportunities
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {aiOpportunities.map(
              ([title, opportunity]) => (

                <div
                  key={title}
                  className="rounded-lg border border-slate-300 p-5"
                >

                  <h3 className="font-semibold text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {opportunity}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* -------------------------------- */}
        {/* FUTURE PROCESS */}
        {/* -------------------------------- */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Future Process
          </h2>

          <div className="mt-5 space-y-3">

            {futureProcess.map(
              ([activity, responsibility], index) => (

                <div
                  key={activity}
                  className="flex items-center gap-4"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                    {index + 1}
                  </div>

                  <div className="flex flex-1 items-center justify-between rounded-lg border border-slate-300 p-4">

                    <span className="font-medium text-slate-900">
                      {activity}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {responsibility}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* -------------------------------- */}
        {/* BACK BUTTON */}
        {/* -------------------------------- */}

        <div className="pt-2 pb-8">

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
          >
            Back to Dashboard
          </button>

        </div>

      </main>

    </div>
  )
}

export default Analysis