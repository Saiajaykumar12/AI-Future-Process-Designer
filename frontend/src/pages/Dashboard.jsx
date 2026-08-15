import { useNavigate } from "react-router-dom"

function Dashboard() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <h1 className="text-2xl font-bold text-slate-900">
            AI Future Process Designer
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyse business processes and design AI-enabled future states.
          </p>

        </div>
      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Industries
            </p>

            <p className="mt-2 text-3xl font-bold">
              4
            </p>
          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Processes
            </p>

            <p className="mt-2 text-3xl font-bold">
              12
            </p>
          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Analyses
            </p>

            <p className="mt-2 text-3xl font-bold">
              18
            </p>
          </div>

        </div>


        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold">
                Business Processes
              </h2>

              <p className="text-sm text-slate-500">
                Recent process analyses
              </p>

            </div>


            <button
              onClick={() => navigate("/process/new")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              + New Process
            </button>

          </div>


          <div className="mt-6 space-y-4">

            <div className="rounded-lg border p-4">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Order Fulfilment
                  </h3>

                  <p className="text-sm text-slate-500">
                    Retail
                  </p>

                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  Analysed
                </span>

              </div>

            </div>


            <div className="rounded-lg border p-4">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Claims Processing
                  </h3>

                  <p className="text-sm text-slate-500">
                    Insurance
                  </p>

                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                  Pending
                </span>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard