import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import NewProcess from "./pages/NewProcess"
import Analysis from "./pages/Analysis"
import Comparison from "./pages/Comparison"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Create New Process */}
        <Route
          path="/process/new"
          element={<NewProcess />}
        />

        {/* AI Process Analysis */}
        <Route
          path="/process/:processId"
          element={<Analysis />}
        />

        {/* Process Comparison */}
        <Route
          path="/process/:id/compare"
          element={<Comparison />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App