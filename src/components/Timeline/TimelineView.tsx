import { useTaskStore } from "../../context/TaskStore";

export default function TimelineView() {
  const tasks = useTaskStore((state) => state.tasks);

  const startOfMonth = new Date(2026, 2, 1); // March start
  const dayWidth = 20;

  // ✅ Today calculation
  const today = new Date();
  const todayIndex =
    (today.getTime() - startOfMonth.getTime()) / 86400000;

  // ✅ Empty state
  if (tasks.length === 0) {
    return <div className="p-4 text-gray-400">No tasks to display</div>;
  }

  return (
    <div className="p-4">
      {/* ✅ Horizontal Scroll */}
      <div className="overflow-x-auto">

        {/* ✅ Timeline Container */}
        <div
          style={{ width: "2000px", position: "relative" }}
          className="bg-white"
        >

          {/* 🔥 GRID LINES (NEW) */}
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{
                left: `${i * dayWidth}px`,
              }}
            />
          ))}

          {/* 🔥 TODAY LINE */}
          <div
            className="absolute top-0 w-[2px] bg-red-500 h-full z-10"
            style={{ left: `${todayIndex * dayWidth}px` }}
          />

          {/* 🔥 TASK ROWS */}
          {tasks.map((task, index) => {
            const startDate = new Date(task.startDate || task.dueDate);
            const endDate = new Date(task.dueDate);

            // ✅ CALCULATIONS
            const startOffset =
              ((startDate.getTime() - startOfMonth.getTime()) /
                86400000) *
              dayWidth;

            const duration =
              ((endDate.getTime() - startDate.getTime()) /
                86400000 +
                1) *
              dayWidth;

            return (
              <div
                key={task.id}
                className="relative h-10 border-b border-gray-200"
              >
                {/* 🔥 TASK BAR WITH TOOLTIP */}
                <div
                  className="
                    absolute bg-blue-500 h-6 rounded flex items-center
                    hover:bg-blue-600 transition-all duration-200
                    shadow-sm hover:shadow-md
                  "
                  style={{
                    left: `${startOffset}px`,
                    width: `${duration}px`,
                    top: "5px",
                  }}
                  title={`${task.title} (Due: ${task.dueDate})`} // 🔥 TOOLTIP
                >
                  <span className="text-xs text-white px-2 truncate">
                    {task.title}
                  </span>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}