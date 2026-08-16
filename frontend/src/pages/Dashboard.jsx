import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  const [processes, setProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/processes"
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail || "Could not load processes"
          )
        }

        setProcesses(data)
      } catch (err) {
        console.error("DASHBOARD ERROR:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProcesses()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                AI Future Process Designer
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Analyse and transform business processes with AI
              </p>
            </div>

            <button
              onClick={() => navigate("/process/new")}
              className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
            >
              New Process
            </button>

          </div>

        </div>
      </header>


      <main className="mx-auto max-w-6xl px-6 py-8">

        <h2 className="text-lg font-semibold text-slate-900">
          Your Processes
        </h2>


        {loading && (
          <p className="mt-6 text-slate-500">
            Loading processes...
          </p>
        )}


        {error && (
          <p className="mt-6 text-red-600">
            {error}
          </p>
        )}


        {!loading && !error && processes.length === 0 && (
          <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">

            <p className="text-slate-500">
              No processes created yet.
            </p>

            <button
              onClick={() => navigate("/process/new")}
              className="mt-4 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
            >
              Create Your First Process
            </button>

          </div>
        )}


        <div className="mt-6 grid gap-4">

          {processes.map((process) => (

            <div
              key={process.id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {process.industry}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {process.process_name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {process.description}
                  </p>

                </div>


                <div className="ml-6 flex shrink-0 items-center gap-3">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {process.status}
                  </span>

                  <button
                    onClick={() => navigate(`/process/${process.id}`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    Analyse
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}

export default Dashboard