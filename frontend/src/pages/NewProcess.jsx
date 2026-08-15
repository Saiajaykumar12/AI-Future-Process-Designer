function NewProcess() {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <h1 className="text-2xl font-bold">
            Create New Process
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Enter a business process for AI analysis.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div>
            <label className="text-sm font-medium">
              Industry
            </label>

            <select className="mt-2 w-full rounded-lg border px-4 py-3">
              <option>Retail</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Insurance</option>
              <option>Manufacturing</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">
              Process Name
            </label>

            <input
              type="text"
              placeholder="e.g. Order Fulfilment"
              className="mt-2 w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">
              Process Description
            </label>

            <textarea
              rows="5"
              placeholder="Describe how the process currently works..."
              className="mt-2 w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">
              Business Objective
            </label>

            <textarea
              rows="3"
              placeholder="What should the future process improve?"
              className="mt-2 w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button className="mt-8 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white">
            Analyse Process
          </button>

        </div>

      </main>

    </div>
  )
}

export default NewProcess