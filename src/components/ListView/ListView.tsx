import { useTaskStore } from "../../context/TaskStore";
import { useState } from "react";
import { Status } from "../../data/seedData";

export default function ListView() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  // ✅ Scroll state
  const [scrollTop, setScrollTop] = useState(0);
  const rowHeight = 60;

  // ✅ Sort state
  const [sort, setSort] = useState({
    key: "title",
    dir: "asc",
  });

  // ✅ Sort logic
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

  // ✅ Virtual scroll calculation
  const start = Math.floor(scrollTop / rowHeight);
  const end = start + 20;
  const visibleTasks = sortedTasks.slice(start, end);
if (tasks.length === 0) {
  return (
    <div className="p-4 text-center">
      <p>No tasks found</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        Clear Filters
      </button>
    </div>
  );
}
  return (
    <div className="p-4">

      {/* Header */}
      <div className="grid grid-cols-5 bg-gray-200 border font-bold">
        <div
          className="p-2 cursor-pointer"
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
          className="p-2 cursor-pointer"
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
          className="p-2 cursor-pointer"
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

      {/* Virtual Scroll Container */}
      <div
        className="h-[400px] overflow-y-auto border"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: sortedTasks.length * rowHeight }}>
          
          <div style={{ transform: `translateY(${start * rowHeight}px)` }}>
            
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-5 border p-2 items-center"
                style={{ height: rowHeight }}
              >
                <div>{task.title}</div>
                <div>{task.assignee}</div>
                <div>{task.priority}</div>

                <div>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value as any)
                    }
                    className="border p-1"
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>In Review</option>
                    <option>Done</option>
                  </select>
                </div>

                <div>{task.dueDate}</div>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}