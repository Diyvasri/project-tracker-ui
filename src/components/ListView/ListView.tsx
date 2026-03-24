import React, { useState, useMemo } from "react";
import { Task, Status } from "../../data/seedData";

interface Props {
  tasks: Task[];
  onStatusChange: (id: string, status: Status) => void;
}

type SortKey = "title" | "priority" | "dueDate";
type Direction = "asc" | "desc";

const priorityOrder: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

function ListView({ tasks, onStatusChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [direction, setDirection] = useState<Direction>("asc");
  const [scrollTop, setScrollTop] = useState(0);

  // ✅ NEW: SEARCH STATE
  const [search, setSearch] = useState("");

  // 🔥 SORT LOGIC
  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortKey === "priority") {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (sortKey === "dueDate") {
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      return 0;
    });

    return direction === "asc" ? sorted : sorted.reverse();
  }, [tasks, sortKey, direction]);

  // ✅ NEW: FILTER LOGIC (Top 1% version)
  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((t) =>
      [t.title, t.assignee, t.priority]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [sortedTasks, search]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  // 🔥 EMPTY STATE
  if (filteredTasks.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tasks found
      </div>
    );
  }

  // 🔥 VIRTUAL SCROLL (UPDATED to use filteredTasks)
  const rowHeight = 60;
  const containerHeight = 500;

  const totalHeight = filteredTasks.length * rowHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
  const endIndex = Math.min(
    filteredTasks.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + 5
  );

  const visibleTasks = filteredTasks.slice(startIndex, endIndex);

  return (
    <div className="p-4">

      {/* ✅ NEW: SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="border p-2 mb-3 w-full rounded"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* HEADER */}
      <div className="grid grid-cols-5 items-center p-2 border-b bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition">
        <div onClick={() => handleSort("title")} className="cursor-pointer">
          Title{" "}
          {sortKey === "title"
            ? direction === "asc"
              ? "🔼"
              : "🔽"
            : ""}
        </div>

        <div>Assignee</div>

        <div onClick={() => handleSort("priority")} className="cursor-pointer">
          Priority{" "}
          {sortKey === "priority"
            ? direction === "asc"
              ? "🔼"
              : "🔽"
            : ""}
        </div>

        <div onClick={() => handleSort("dueDate")} className="cursor-pointer">
          Due Date{" "}
          {sortKey === "dueDate"
            ? direction === "asc"
              ? "🔼"
              : "🔽"
            : ""}
        </div>

        <div>Status</div>
      </div>

      {/* 🔥 VIRTUAL LIST */}
      <div
        className="h-[500px] overflow-y-auto relative"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleTasks.map((task, index) => {
            const actualIndex = startIndex + index;

            const todayDate = new Date();
            const taskDate = new Date(task.dueDate);

            const isToday =
              taskDate.toDateString() === todayDate.toDateString();

            const isOverdue = taskDate < todayDate && !isToday;

            const diffDays = Math.floor(
              (todayDate.getTime() - taskDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={task.id}
                style={{
                  position: "absolute",
                  top: actualIndex * rowHeight,
                  left: 0,
                  right: 0,
                  height: rowHeight,
                }}
                className="grid grid-cols-5 items-center p-2 border-b hover:bg-gray-50"
              >
                <div>{task.title}</div>
                <div>{task.assignee}</div>

                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.priority === "Critical"
                        ? "bg-red-500 text-white"
                        : task.priority === "High"
                        ? "bg-orange-400 text-white"
                        : task.priority === "Medium"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div
                  className={
                    isOverdue
                      ? "text-red-600 font-semibold"
                      : isToday
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  }
                >
                  {isToday
                    ? "Due Today"
                    : isOverdue
                    ? `${diffDays} day${diffDays > 1 ? "s" : ""} overdue`
                    : new Date(task.dueDate).toLocaleDateString()}
                </div>

                <select
                  value={task.status}
                  onChange={(e) =>
                    onStatusChange(task.id, e.target.value as Status)
                  }
                  className="border rounded px-1 py-0.5"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Done</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListView;