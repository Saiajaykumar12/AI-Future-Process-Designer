import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "")

function NewProcess() {
  const navigate = useNavigate()

  const [industry, setIndustry] = useState("Retail")
  const [processName, setProcessName] = useState("")
  const [description, setDescription] = useState("")
  const [objective, setObjective] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    if (!processName.trim()) {
      setError("Please enter a process name.")
      return
    }

    if (!description.trim()) {
      setError("Please describe the current process.")
      return
    }

    if (!objective.trim()) {
      setError("Please enter the business objective.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/api/processes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            industry,
            process_name: processName.trim(),
            description: description.trim(),
            objective: objective.trim(),
          }),
        }
      )

      // Read the response safely
      const responseText = await response.text()

      let data = null

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Invalid JSON response:", responseText)

          throw new Error(
            "The backend returned an invalid response. Please check that the backend API is running."
          )
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            `Could not create process. Server returned ${response.status}.`
        )
      }

      if (!data || !data.id) {
        throw new Error(
          "Process was not created correctly. The backend did not return a process ID."
        )
      }

      console.log("PROCESS CREATED:", data)

      navigate(`/process/${data.id}`)
    } catch (err) {
      console.error("CREATE PROCESS ERROR:", err)

      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          `Could not connect to the backend at ${API_BASE_URL}. Make sure the FastAPI server is running.`
        )
      } else {
        setError(
          err.message || "Could not create the process."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-4xl px-6 py-6">

          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Create New Process
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Describe your current business process and let AI
            identify opportunities for transformation.
          </p>

        </div>

      </header>


      {/* MAIN */}

      <main className="mx-auto max-w-4xl px-6 py-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm md:p-8"
        >

          {/* INDUSTRY */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Industry
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Select the industry that best matches your process.
            </p>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              <option>Retail</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Insurance</option>
              <option>Manufacturing</option>
              <option>Logistics</option>
              <option>Education</option>
              <option>Other</option>
            </select>

          </div>


          {/* PROCESS NAME */}

          <div className="mt-6">

            <label className="text-sm font-semibold text-slate-700">
              Process Name
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Give the business process a clear name.
            </p>

            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g. Order Fulfilment"
              className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />

          </div>


          {/* DESCRIPTION */}

          <div className="mt-6">

            <div className="flex items-center justify-between">

              <label className="text-sm font-semibold text-slate-700">
                Current Process Description
              </label>

              <span className="text-xs text-slate-400">
                {description.length} characters
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              Explain how the process currently works, including
              important manual activities and decisions.
            </p>

            <textarea
              rows="7"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: Customers place orders through the website. Staff manually check inventory, pick items, pack the order and arrange shipping..."
              className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />

          </div>


          {/* OBJECTIVE */}

          <div className="mt-6">

            <div className="flex items-center justify-between">

              <label className="text-sm font-semibold text-slate-700">
                Business Objective
              </label>

              <span className="text-xs text-slate-400">
                {objective.length} characters
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              What should the future process improve?
            </p>

            <textarea
              rows="4"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Example: Reduce processing time, minimise errors and improve customer satisfaction."
              className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />

          </div>


          {/* API INFORMATION */}

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-xs font-medium text-slate-500">
              Backend API
            </p>

            <p className="mt-1 break-all text-xs text-slate-700">
              {API_BASE_URL}
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>

          )}


          {/* ACTIONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Process..."
                : "Create & Analyse →"}
            </button>

          </div>

        </form>


        {/* INFORMATION */}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">

          <h2 className="text-sm font-semibold text-slate-900">
            What happens next?
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <div>

              <div className="text-sm font-semibold">
                01. Process saved
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your process is securely stored in the application database.
              </p>

            </div>


            <div>

              <div className="text-sm font-semibold">
                02. AI analysis
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Gemini analyses the process and identifies problems and AI opportunities.
              </p>

            </div>


            <div>

              <div className="text-sm font-semibold">
                03. Future state
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Review the AI-enabled future process and compare it with the current state.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default NewProcess