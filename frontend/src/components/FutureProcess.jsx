function FutureProcess() {

  const steps = [
    {
      name: "Receive Order",
      responsibility: "System"
    },
    {
      name: "Predict Inventory",
      responsibility: "AI"
    },
    {
      name: "Prioritise Order",
      responsibility: "AI"
    },
    {
      name: "Verify Picking",
      responsibility: "AI"
    },
    {
      name: "Approve Exceptions",
      responsibility: "Human"
    },
    {
      name: "Send Customer Notification",
      responsibility: "AI"
    }
  ]

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold">
        Future Process
      </h2>

      <div className="mt-6 space-y-3">

        {steps.map((step, index) => (

          <div
            key={step.name}
            className="flex items-center gap-4"
          >

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
              {index + 1}
            </div>

            <div className="flex-1 rounded-lg border p-4">

              <div className="flex items-center justify-between">

                <span className="font-medium">
                  {step.name}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {step.responsibility}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}

export default FutureProcess