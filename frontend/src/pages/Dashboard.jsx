import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  const [processes, setProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadProcesses = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "http://127.0.0.1:8000/api/processes"
      )

      if (!response.ok) {
        throw new Error("Could not load processes")
      }

      const data = await response.json()
      setProcesses(data)
    } catch (err) {
      console.error("Dashboard error:", err)
      setError(err.message || "Could not load processes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProcesses()
  }, [])

  const analysedCount = processes.filter(
    (process) => process.status === "Analysed"
  ).length

  const pendingCount = processes.filter(
    (process) => process.status !== "Analysed"
  ).length

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                  AI
                </div>

                <div>

                  <h1 className="text-2xl font-bold text-slate-900">
                    AI Future Process Designer
                  </h1>

                  <p className="text-sm text-slate-500">
                    AI-powered business process transformation
                  </p>

                </div>

              </div>

            </div>


            <button
              onClick={() => navigate("/process/new")}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              + New Process
            </button>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">


        {/* HERO */}

        <section className="rounded-2xl bg-slate-900 p-8 text-white shadow-sm">

          <div className="max-w-3xl">

            <p className="text-sm font-medium text-slate-300">
              BUSINESS PROCESS TRANSFORMATION
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Design smarter processes with AI
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              Analyse your current business processes, identify operational
              problems, discover AI opportunities, and design an improved
              future-state process.
            </p>

            <button
              onClick={() => navigate("/process/new")}
              className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start a New Analysis →
            </button>

          </div>

        </section>


        {/* STATISTICS */}

        <section className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Processes
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {processes.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Business processes created
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              AI Analysed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {analysedCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Processes transformed with AI
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Pending Analysis
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pendingCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Processes waiting for AI analysis
            </p>

          </div>

        </section>


        {/* ERROR */}

        {error && (

          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={loadProcesses}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm"
            >
              Retry
            </button>

          </div>

        )}


        {/* PROCESS WORKSPACE */}

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b p-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Process Workspace
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage and analyse your business processes.
              </p>

            </div>

            {!loading && processes.length > 0 && (

              <span className="text-sm text-slate-500">
                {processes.length} process
                {processes.length !== 1 ? "es" : ""}
              </span>

            )}

          </div>


          {/* LOADING */}

          {loading && (

            <div className="p-10 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>

              <p className="mt-4 text-sm text-slate-500">
                Loading processes...
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading && !error && processes.length === 0 && (

            <div className="p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl">
                +
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No processes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first business process and let AI identify
                problems, opportunities, and future-state improvements.
              </p>

              <button
                onClick={() => navigate("/process/new")}
                className="mt-5 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
              >
                Create First Process
              </button>

            </div>

          )}


          {/* PROCESS LIST */}

          {!loading && processes.length > 0 && (

            <div className="divide-y">

              {processes.map((process) => (

                <div
                  key={process.id}
                  className="p-6 transition hover:bg-slate-50"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* PROCESS INFORMATION */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-base font-semibold text-slate-900">
                          {process.process_name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            process.status === "Analysed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {process.status}
                        </span>

                      </div>


                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">

                        <span>
                          {process.industry}
                        </span>

                        <span>•</span>

                        <span>
                          Process #{process.id}
                        </span>

                      </div>


                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                        {process.description}
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap gap-3">

                      <button
                        onClick={() =>
                          navigate(`/process/${process.id}`)
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        Open Analysis
                      </button>


                      {process.status === "Analysed" && (

                        <button
                          onClick={() =>
                            navigate(
                              `/process/${process.id}/compare`
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Compare
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* HOW IT WORKS */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            How it works
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-4">

            <div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                1
              </div>

              <h3 className="mt-3 font-semibold">
                Describe
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Describe your current business process and objective.
              </p>

            </div>


            <div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                2
              </div>

              <h3 className="mt-3 font-semibold">
                Analyse
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                AI identifies process steps, problems, and opportunities.
              </p>

            </div>


            <div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                3
              </div>

              <h3 className="mt-3 font-semibold">
                Transform
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Generate an AI-enabled future-state process.
              </p>

            </div>


            <div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                4
              </div>

              <h3 className="mt-3 font-semibold">
                Compare
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Compare the current, transition, and future states.
              </p>

            </div>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="pb-6 pt-2 text-center">

          <p className="text-xs text-slate-400">
            AI Future Process Designer
          </p>

        </footer>

      </main>

    </div>
  )
}

export default Dashboard