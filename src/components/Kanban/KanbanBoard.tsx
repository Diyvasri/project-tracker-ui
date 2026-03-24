import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTaskStore } from "../../context/TaskStore";
import KanbanColumn from "./KanbanColumn";
import { Status, Task } from "../../data/seedData";
import { useMemo } from "react";

const columns: Status[] = ["To Do", "In Progress", "In Review", "Done"];

const statusMap: Record<Status, Status> = {
  "To Do": "To Do",
  "In Progress": "In Progress",
  "In Review": "In Review",
  "Done": "Done",
};

export default function KanbanBoard() {
  const tasks = useTaskStore((state) => state.tasks);
  const memoTasks = useMemo(() => tasks, [tasks]);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  // ✅ DRAG STATE
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });



  const [activeUsers, setActiveUsers] = useState<any[]>([
    { id: 1, name: "U1", taskId: null },
    { id: 2, name: "U2", taskId: null },
    { id: 3, name: "U3", taskId: null },
  ]);

  // ✅ FILTER STATE (ARRAY FORMAT)
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 STEP 1: READ FROM URL (ON LOAD)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setFilters({
      status: params.get("status")?.split(",") || [],
      priority: params.get("priority")?.split(",") || [],
      assignee: params.get("assignee")?.split(",") || [],
    });
  }, [location.search]);

  // 🔥 STEP 2: UPDATE URL WHEN FILTER CHANGES
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.status.length) {
      params.set("status", filters.status.join(","));
    }

    if (filters.priority.length) {
      params.set("priority", filters.priority.join(","));
    }

    if (filters.assignee.length) {
      params.set("assignee", filters.assignee.join(","));
    }

    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, navigate]);

  // ✅ DROP
  const handleDrop = (status: Status) => {
    if (!draggingTask) return;

    updateTaskStatus(draggingTask.id, status);
    setDraggingTask(null);
  
  };

  // ✅ COLLAB SIMULATION
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) =>
        prev.map((user) => {
          const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
          return { ...user, taskId: randomTask?.id };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [tasks]);

  // ✅ FILTER LOGIC
  const filteredTasks = useMemo(() => {
  return memoTasks.filter((task) => {
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
}, [memoTasks, filters]);

  return (
    <div className="relative">

      {/* 🔹 FILTER UI */}
      <div className="flex gap-4 mb-4">
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
      </div>

      {/* 🔹 COLUMNS */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {columns.map((col) => (
          <KanbanColumn
            key={col}
            title={col}
            status={statusMap[col]}
            tasks={filteredTasks.filter((t) => t.status === statusMap[col])}
            draggingTask={draggingTask}
            setDraggingTask={setDraggingTask}
            setPosition={setPosition}
            onDrop={handleDrop}
            activeUsers={activeUsers}
          />
        ))}
      </div>

      {/* 🔥 FLOATING CARD */}
      {draggingTask && (
        <div
          className="fixed pointer-events-none bg-white p-3 rounded shadow-lg z-50"
          style={{
            top: position.y,
            left: position.x,
            transform: "translate(-50%, -50%)",
            opacity: 0.8,
          }}
        >
          <strong>{draggingTask.title}</strong>
          <div>{draggingTask.assignee}</div>
        </div>
      )}
    </div>
  );
}