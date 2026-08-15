import { useLocation } from "react-router-dom"
import { demoAnalysis } from "../data/demoAnalysis"

function Analysis() {
  const location = useLocation()

  const {
    industry = "Retail",
    processName = "Order Fulfilment",
    description = "",
    objective = ""
  } = location.state || {}
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <p className="text-sm text-slate-500">
  {industry} / {processName}
</p>

          <h1 className="text-2xl font-bold text-slate-900">
            AI Process Analysis
          </h1>
          <div className="mt-4 rounded-lg bg-slate-100 p-4">

  <p className="text-sm">
    <strong>Description:</strong> {description}
  </p>

  <p className="mt-2 text-sm">
    <strong>Business Objective:</strong> {objective}
  </p>

</div>

        </div>
      </header>


      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">


        {/* CURRENT PROCESS */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Current Process
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-3">

            {[
              "Receive Order",
              "Check Inventory",
              "Pick Items",
              "Pack Items",
              "Ship",
              "Notify Customer"
            ].map((step, index) => (

              <div
                key={step}
                className="flex items-center gap-3"
              >

                <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm">
                  {step}
                </div>

                {index < 5 && (
                  <span className="text-slate-400">
                    →
                  </span>
                )}

              </div>

            ))}

          </div>

        </section>


        {/* PROBLEMS */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Problems Identified
          </h2>

          <div className="mt-5 space-y-3">

            {[
              [
                "Inventory checking",
                "Manual checking causes delays",
                "High"
              ],
              [
                "Picking",
                "Human picking errors",
                "Medium"
              ],
              [
                "Shipping",
                "Manual prioritisation",
                "High"
              ]
            ].map(([activity, problem, severity]) => (

              <div
                key={activity}
                className="flex items-center justify-between rounded-lg border p-4"
              >

                <div>

                  <p className="font-medium">
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

            ))}

          </div>

        </section>


        {/* AI OPPORTUNITIES */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            AI Opportunities
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {[
              [
                "Demand Forecasting",
                "Predict future inventory requirements"
              ],
              [
                "Order Prioritisation",
                "Automatically rank urgent orders"
              ],
              [
                "Computer Vision",
                "Verify picked items"
              ]
            ].map(([title, description]) => (

              <div
                key={title}
                className="rounded-lg border p-5"
              >

                <h3 className="font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* FUTURE PROCESS */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Future Process
          </h2>

          <div className="mt-5 space-y-3">

            {[
              ["Receive Order", "System"],
              ["Predict Inventory", "AI"],
              ["Prioritise Order", "AI"],
              ["Verify Picking", "AI"],
              ["Approve Exceptions", "Human"],
              ["Notify Customer", "AI"]
            ].map(([activity, responsibility], index) => (

              <div
                key={activity}
                className="flex items-center gap-4"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                  {index + 1}
                </div>

                <div className="flex flex-1 items-center justify-between rounded-lg border p-4">

                  <span className="font-medium">
                    {activity}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {responsibility}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default Analysis