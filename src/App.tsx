import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import KanbanBoard from "./components/Kanban/KanbanBoard";
import TimelineView from "./components/Timeline/TimelineView";
import ListView from "./components/ListView/ListView";
import { useTaskStore } from "./context/TaskStore";
import { Status } from "./data/seedData";

// Kanban Page
function Kanban() {
  return <KanbanBoard />;
}

// ✅ LIST PAGE (FIXED)
function List() {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);

  // 🔥 status update handler
  const handleStatusChange = (id: string, status: Status) => {
  setTasks(
    tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    )
  );
};

  return (
    <ListView
      tasks={tasks}
      onStatusChange={handleStatusChange}
    />
  );
}

// Timeline Page
function Timeline() {
  return <TimelineView />;
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">
          Project Tracker
        </h1>

        {/* Navigation */}
        <div className="space-x-4 mb-6">
          <Link className="text-blue-600" to="/kanban">
            Kanban
          </Link>
          <Link className="text-blue-600" to="/list">
            List
          </Link>
          <Link className="text-blue-600" to="/timeline">
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