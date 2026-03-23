// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import KanbanBoard from "./components/Kanban/KanbanBoard";
import TimelineView from "./components/Timeline/TimelineView";
import { useTaskStore } from "./context/TaskStore"; // ✅ correct

// Kanban route component
function Kanban() {
  return <KanbanBoard />;
}

// List route component (placeholder)
function List() {
  const tasks = useTaskStore((state) => state.tasks);
  console.log("List Tasks:", tasks);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">List View (Coming Soon)</h2>
      {/* You can later add ListView component */}
    </div>
  );
}

// Timeline route component
function Timeline() {
  return <TimelineView />;
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">Project Tracker</h1>

        {/* Navigation Links */}
        <div className="space-x-4 mb-6">
          <Link
            className="text-blue-600 hover:underline"
            to="/kanban"
          >
            Kanban
          </Link>
          <Link
            className="text-blue-600 hover:underline"
            to="/list"
          >
            List
          </Link>
          <Link
            className="text-blue-600 hover:underline"
            to="/timeline"
          >
            Timeline
          </Link>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Kanban />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/list" element={<List />} />
          <Route path="/timeline" element={<Timeline />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;