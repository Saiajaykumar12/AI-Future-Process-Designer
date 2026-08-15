import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

    // Basic validation
    if (!processName.trim()) {
      setError("Please enter a process name.")
      return
    }

    if (!description.trim()) {
      setError("Please enter a process description.")
      return
    }

    if (!objective.trim()) {
      setError("Please enter a business objective.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/processes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: industry,
          process_name: processName,
          description: description,
          objective: objective,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create process")
      }

      const data = await response.json()

      console.log("Process created:", data)

      // Navigate to the analysis page using the ID
      navigate(`/process/${data.id}`, {
        state: {
          industry,
          processName,
          description,
          objective,
        },
      })
    } catch (err) {
      console.error(err)

      setError(
        "Could not connect to the backend. Make sure your FastAPI server is running."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">

          <h1 className="text-2xl font-bold text-slate-900">
            Create New Process
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Enter a business process for AI analysis.
          </p>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >

          {/* Industry */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Industry
            </label>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option>Retail</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Insurance</option>
              <option>Manufacturing</option>
              <option>Other</option>
            </select>
          </div>

          {/* Process Name */}
          <div className="mt-6">

            <label className="text-sm font-medium text-slate-700">
              Process Name
            </label>

            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g. Customer Returns Management"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            />

          </div>

          {/* Description */}
          <div className="mt-6">

            <label className="text-sm font-medium text-slate-700">
              Process Description
            </label>

            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how the process currently works..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            />

          </div>

          {/* Business Objective */}
          <div className="mt-6">

            <label className="text-sm font-medium text-slate-700">
              Business Objective
            </label>

            <textarea
              rows="3"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What should the future process improve?"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            />

          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Process..." : "Analyse Process"}
          </button>

        </form>

      </main>

    </div>
  )
}

export default NewProcess