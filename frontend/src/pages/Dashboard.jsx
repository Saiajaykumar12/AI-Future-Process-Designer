import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Dashboard() {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/processes`);

      if (!response.ok) {
        throw new Error(
          `Failed to load processes (${response.status})`
        );
      }

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Backend returned an invalid response.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid process data received from backend.");
      }

      setProcesses(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load processes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const totalProcesses = processes.length;

  const analysedProcesses = processes.filter(
    (process) =>
      process.status?.toLowerCase() === "analysed" ||
      process.status?.toLowerCase() === "analyzed"
  ).length;

  const pendingProcesses = processes.filter(
    (process) =>
      !process.status ||
      process.status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                AI FUTURE PROCESS DESIGNER
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Process Transformation Dashboard
              </h1>
            </div>

            <Link
              to="/process/new"
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + New Analysis
            </Link>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Hero */}
        <section className="rounded-2xl bg-slate-900 px-8 py-10 text-white shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Business Process Transformation
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight">
            Design smarter processes with AI
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Analyse your current business processes, identify operational
            problems, discover AI opportunities, and design an improved
            future-state process.
          </p>

          <div className="mt-7">
            <Link
              to="/process/new"
              className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start a New Analysis →
            </Link>
          </div>

        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4">

            <div>
              <p className="font-medium text-red-700">
                Unable to load processes
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              onClick={fetchProcesses}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
            >
              Retry
            </button>

          </div>
        )}

        {/* Statistics */}
        <section className="mt-7 grid gap-5 md:grid-cols-3">

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Processes
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "—" : totalProcesses}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Business processes created
            </p>
          </div>


          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              AI Analysed
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "—" : analysedProcesses}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Processes transformed with AI
            </p>
          </div>


          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Analysis
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "—" : pendingProcesses}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Processes waiting for AI analysis
            </p>
          </div>

        </section>


        {/* Process Workspace */}
        <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Process Workspace
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and analyse your business processes.
                </p>
              </div>

              <Link
                to="/process/new"
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                Create Process →
              </Link>

            </div>

          </div>


          {/* Loading */}
          {loading && (
            <div className="px-6 py-12 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm text-slate-500">
                Loading processes...
              </p>

            </div>
          )}


          {/* Empty state */}
          {!loading && !error && processes.length === 0 && (
            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                +
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No processes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first business process and use AI to identify
                problems, opportunities, and a future-state process.
              </p>

              <Link
                to="/process/new"
                className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Start Your First Analysis →
              </Link>

            </div>
          )}


          {/* Process list */}
          {!loading && !error && processes.length > 0 && (
            <div className="divide-y divide-slate-200">

              {processes.map((process) => {

                const isAnalysed =
                  process.status?.toLowerCase() === "analysed" ||
                  process.status?.toLowerCase() === "analyzed";

                return (
                  <div
                    key={process.id}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="truncate text-base font-semibold text-slate-900">
                          {process.process_name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isAnalysed
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {process.status || "Pending"}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {process.industry}
                      </p>

                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                        {process.description}
                      </p>

                    </div>


                    <div className="flex shrink-0 gap-3">

                      <Link
                        to={`/process/${process.id}`}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View Process
                      </Link>

                      {isAnalysed && (
                        <Link
                          to={`/analysis/${process.id}`}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          View Analysis
                        </Link>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>


        {/* How it works */}
        <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            How it works
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-4">

            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                01
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Define Process
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Describe your current business process and its objective.
              </p>
            </div>


            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                02
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                AI Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Gemini analyses the process and identifies operational
                problems and AI opportunities.
              </p>
            </div>


            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                03
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Future State
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review the AI-enabled future process and responsibilities.
              </p>
            </div>


            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                04
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Compare & Export
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Compare current and future states and export the analysis
                as a PDF.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;