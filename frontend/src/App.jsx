import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import NewProcess from "./pages/NewProcess"
import Analysis from "./pages/Analysis"
import Comparison from "./pages/Comparison"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/process/new"
          element={<NewProcess />}
        />

        <Route
          path="/process/:id"
          element={<Analysis />}
        />

        <Route
          path="/process/:id/compare"
          element={<Comparison />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App