import { useTaskStore } from "../../context/TaskStore";
import { useState } from "react";

export default function ListView() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const rowHeight = 60;
  const visibleCount = 10;

  const [scrollTop, setScrollTop] = useState(0);
const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  const [sort, setSort] = useState({
    key: "title",
    dir: "asc",
  });
const sortedTasks = [...tasks].sort((a: any, b: any) => {
    if (sort.key === "title") {
      return sort.dir === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    if (sort.key === "priority") {
      const order = ["Critical", "High", "Medium", "Low"];
      return sort.dir === "asc"
        ? order.indexOf(a.priority) - order.indexOf(b.priority)
        : order.indexOf(b.priority) - order.indexOf(a.priority);
    }

    if (sort.key === "dueDate") {
      return sort.dir === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }

    return 0;
  });

  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = startIndex + visibleCount;
  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  // ✅ EMPTY STATE WITH POLISH
  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 mb-3">🚀 No tasks found</p>
        <button
          onClick={() => window.location.reload()}
          className="
            px-4 py-2 bg-blue-500 text-white rounded-lg
            transition-all duration-200
            hover:bg-blue-600 hover:shadow-md
            active:scale-95
          "
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* 🔥 HEADER + ACTION */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>

        <button
          className="
            px-4 py-2 bg-blue-500 text-white rounded-lg
            transition-all duration-200
            hover:bg-blue-600 hover:shadow-md
            active:scale-95
          "
        >
          + Add Task
        </button>
      </div>

      {/* 🔹 TABLE HEADER */}
      <div className="grid grid-cols-5 bg-gray-100 border border-gray-200 font-semibold text-gray-700 rounded-t-lg">
        <div
          className="p-2 cursor-pointer hover:text-blue-600 transition"
          onClick={() =>
            setSort({
              key: "title",
              dir: sort.dir === "asc" ? "desc" : "asc",
            })
          }
        >
          Title
        </div>

        <div className="p-2">Assignee</div>

        <div
          className="p-2 cursor-pointer hover:text-blue-600 transition"
          onClick={() =>
            setSort({
              key: "priority",
              dir: sort.dir === "asc" ? "desc" : "asc",
            })
          }
        >
          Priority
        </div>

        <div className="p-2">Status</div>

        <div
          className="p-2 cursor-pointer hover:text-blue-600 transition"
          onClick={() =>
            setSort({
              key: "dueDate",
              dir: sort.dir === "asc" ? "desc" : "asc",
            })
          }
        >
          Due Date
        </div>
      </div>

      {/* 🔥 SCROLL CONTAINER */}
      <div
        style={{ height: "400px" }}
        className="overflow-auto scroll-smooth border-x border-b border-gray-200 rounded-b-lg"
        onScroll={onScroll}
      >
        <div
          style={{ height: sortedTasks.length * rowHeight }}
          className="relative"
        >
          <div
            style={{
              transform: `translateY(${startIndex * rowHeight}px)`,
            }}
          >
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                style={{ height: rowHeight }}
                className="
                  grid grid-cols-5 items-center px-3 border-b
                  hover:bg-gray-50 transition-all duration-200
                "
              >
                <div className="font-medium">{task.title}</div>
                <div>{task.assignee}</div>
                <div>{task.priority}</div>

                {/* 🔥 POLISHED SELECT */}
                <div>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value as any)
                    }
                    className="
                      border border-gray-300 rounded px-2 py-1
                      transition-all duration-200
                      hover:border-blue-400
                      focus:ring-2 focus:ring-blue-200 outline-none
                    "
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>In Review</option>
                    <option>Done</option>
                  </select>
                </div>

                <div className="text-sm text-gray-500">
                  {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}