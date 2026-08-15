function Analysis() {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <p className="text-sm text-slate-500">
            Retail / Order Fulfilment
          </p>

          <h1 className="text-2xl font-bold">
            AI Process Analysis
          </h1>

        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* Current Process */}

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
              <div key={step} className="flex items-center gap-3">

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


        {/* Problems */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Problems Identified
          </h2>

          <div className="mt-5 space-y-3">

            {[
              ["Inventory checking", "Manual checking causes delays", "High"],
              ["Picking", "Human picking errors", "Medium"],
              ["Shipping", "Manual prioritisation", "High"]
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


        {/* AI Opportunities */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            AI Opportunities
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {[
              ["Demand Forecasting", "Predict future inventory requirements"],
              ["Order Prioritisation", "Automatically rank urgent orders"],
              ["Computer Vision", "Verify picked items"]
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

      </main>

    </div>
  )
}

export default Analysis