import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTaskStore } from "../../context/TaskStore";
import KanbanColumn from "./KanbanColumn";
import { Status } from "../../data/seedData";

// Kanban columns
const columns: Status[] = ["To Do", "In Progress", "In Review", "Done"];

// map title → status
const statusMap: Record<Status, Status> = {
  "To Do": "To Do",
  "In Progress": "In Progress",
  "In Review": "In Review",
  "Done": "Done",
};

export default function KanbanBoard() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  // ✅ Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDropped, setIsDropped] = useState(false);

  // ✅ Collaboration users
  const [activeUsers, setActiveUsers] = useState<any[]>([
    { id: 1, name: "U1", taskId: null },
    { id: 2, name: "U2", taskId: null },
    { id: 3, name: "U3", taskId: null },
  ]);

  // ✅ Filters state
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
  });

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load filters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      status: searchParams.get("status")?.split(",") || [],
      priority: searchParams.get("priority")?.split(",") || [],
      assignee: searchParams.get("assignee")?.split(",") || [],
    });
  }, [location.search]);

  // ✅ Update URL
  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (filters.status.length)
      searchParams.set("status", filters.status.join(","));

    if (filters.priority.length)
      searchParams.set("priority", filters.priority.join(","));

    if (filters.assignee.length)
      searchParams.set("assignee", filters.assignee.join(","));

    navigate(`?${searchParams.toString()}`, { replace: true });
  }, [filters, navigate]);

  // ✅ Drop handler
  const handleDrop = (e: any, status: Status) => {
    if (!draggingId) return;

    updateTaskStatus(draggingId, status);
    setDraggingId(null);
    setIsDropped(true);
  };

  // ✅ Snap back
  useEffect(() => {
    if (draggingId && !isDropped) {
      const timer = setTimeout(() => {
        setDraggingId(null);
      }, 200);

      return () => clearTimeout(timer);
    }

    setIsDropped(false);
  }, [draggingId, isDropped]);

  // ✅ Collaboration simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) =>
        prev.map((user) => {
          const randomTask =
            tasks[Math.floor(Math.random() * tasks.length)];

          return {
            ...user,
            taskId: randomTask?.id,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [tasks]);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  setFilters({
    status: params.get("status")?.split(",") || [],
    priority: params.get("priority")?.split(",") || [],
    assignee: params.get("assignee")?.split(",") || [],
  });
}, []);

  // ✅ Apply filters
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filters.status.length
      ? filters.status.includes(task.status)
      : true;

    const priorityMatch = filters.priority.length
      ? filters.priority.includes(task.priority)
      : true;

    const assigneeMatch = filters.assignee.length
      ? filters.assignee.includes(task.assignee)
      : true;

    return statusMatch && priorityMatch && assigneeMatch;
  });

  return (
    <div className="relative">

      {/* 🔥 FILTER UI */}
      <div className="flex gap-4 mb-4">

        {/* Status */}
        <select
          multiple
          onChange={(e) =>
            setFilters({
              ...filters,
              status: Array.from(e.target.selectedOptions, (o) => o.value),
            })
          }
          className="border p-2"
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>In Review</option>
          <option>Done</option>
        </select>

        {/* Priority */}
        <select
          multiple
          onChange={(e) =>
            setFilters({
              ...filters,
              priority: Array.from(e.target.selectedOptions, (o) => o.value),
            })
          }
          className="border p-2"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        {/* Assignee */}
        <select
          multiple
          onChange={(e) =>
            setFilters({
              ...filters,
              assignee: Array.from(e.target.selectedOptions, (o) => o.value),
            })
          }
          className="border p-2"
        >
          <option>AD</option>
          <option>MK</option>
          <option>SN</option>
          <option>LR</option>
          <option>DV</option>
          <option>RS</option>
        </select>

      </div>

      {/* Columns */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {columns.map((col) => (
          <KanbanColumn
            key={col}
            title={col}
            status={statusMap[col]}
            tasks={filteredTasks.filter(
              (t) => t.status === statusMap[col]
            )}
            draggingId={draggingId}
            setDraggingId={setDraggingId}
            setPosition={setPosition}
            onDrop={handleDrop}
            activeUsers={activeUsers}
          />
        ))}
      </div>

      {/* Drag preview */}
      {draggingId !== null && (
        <div
          className="fixed pointer-events-none bg-white p-2 shadow rounded opacity-70 z-50"
          style={{
            top: position.y,
            left: position.x,
          }}
        >
          Dragging...
        </div>
      )}
    </div>
  );
}