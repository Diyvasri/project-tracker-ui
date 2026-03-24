import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTaskStore } from "../../context/TaskStore";
import KanbanColumn from "./KanbanColumn";
import { Status } from "../../data/seedData";
import { DndContext } from "@dnd-kit/core";

const columns: Status[] = ["To Do", "In Progress", "In Review", "Done"];

export default function KanbanBoard() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
  });

  /* ✅ AUTO SAVE TO LOCAL STORAGE (VERY IMPORTANT) */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* 🔥 READ FILTER FROM URL */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setFilters({
      status: params.get("status")?.split(",") || [],
      priority: params.get("priority")?.split(",") || [],
      assignee: params.get("assignee")?.split(",") || [],
    });
  }, [location.search]);

  /* 🔥 UPDATE URL */
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

  /* 🔥 FILTER LOGIC */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
  }, [tasks, filters]);

  /* 🔥 DRAG END */
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    updateTaskStatus(active.id, over.id as Status);
  };

  return (
    <div className="p-4">

      {/* FILTER */}
      <div className="flex gap-4 mb-4">
        <select
          multiple
          onChange={(e) =>
            setFilters({
              ...filters,
              status: Array.from(
                e.target.selectedOptions,
                (o) => o.value
              ),
            })
          }
          className="border p-2 rounded"
        >
          {columns.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>
      </div>

      {/* 🔥 RESPONSIVE WRAPPER */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[800px] mt-6">

            {columns.map((col) => (
              <KanbanColumn
                key={col}
                title={col}
                status={col}
                tasks={filteredTasks.filter(
                  (t) => t.status === col
                )}
              />
            ))}

          </div>
        </div>
      </DndContext>
    </div>
  );
}