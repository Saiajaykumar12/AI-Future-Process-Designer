function Comparison() {

  const comparisons = [
    {
      current: "Manual inventory checking",
      transition: "Introduce AI demand forecasting",
      future: "Predictive inventory monitoring"
    },
    {
      current: "Manual order prioritisation",
      transition: "AI recommends priority",
      future: "Automated order prioritisation"
    },
    {
      current: "Manual picking verification",
      transition: "Introduce computer vision",
      future: "AI verifies picked items"
    },
    {
      current: "Manual customer notification",
      transition: "Introduce AI communication",
      future: "Automated customer updates"
    },
    {
      current: "Human handles every issue",
      transition: "Human-in-the-loop exceptions",
      future: "Human handles complex exceptions"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <p className="text-sm text-slate-500">
            Retail / Order Fulfilment
          </p>

          <h1 className="text-2xl font-bold">
            Current → Transition → Future
          </h1>

        </div>
      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="grid grid-cols-3 border-b">

            <div className="bg-slate-100 p-5 font-semibold">
              CURRENT
            </div>

            <div className="bg-slate-100 p-5 font-semibold">
              TRANSITION
            </div>

            <div className="bg-slate-100 p-5 font-semibold">
              FUTURE
            </div>

          </div>


          {comparisons.map((item, index) => (

            <div
              key={index}
              className="grid grid-cols-3 border-b last:border-b-0"
            >

              <div className="p-5 text-sm">
                {item.current}
              </div>

              <div className="border-x p-5 text-sm text-slate-600">
                {item.transition}
              </div>

              <div className="p-5 text-sm font-medium">
                {item.future}
              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}

export default Comparison