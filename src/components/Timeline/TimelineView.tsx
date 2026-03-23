import { useTaskStore } from "../../context/TaskStore";

export default function TimelineView() {
  const tasks = useTaskStore((state) => state.tasks);

  const startOfMonth = new Date(2026, 2, 1); // March
  const dayWidth = 20;

  // ✅ Today calculation (OUTSIDE map)
  const today = new Date();
  const todayIndex =
    (today.getTime() - startOfMonth.getTime()) / 86400000;

  return (
    <div className="p-4 overflow-x-auto">
      <div className="relative border h-[400px] w-[1200px]">

        {/* ✅ Today line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-red-500"
          style={{ left: todayIndex * dayWidth }}
        />

        {/* ✅ Tasks */}
        {tasks.map((task, index) => {
          const start = new Date(task.startDate || task.dueDate);
          const end = new Date(task.dueDate);

          const startOffset =
            (start.getTime() - startOfMonth.getTime()) / 86400000;

          const days =
            (end.getTime() - start.getTime()) / 86400000 + 1;

          const left = startOffset * dayWidth;
          const width = days * dayWidth;

        if (tasks.length === 0) {
  return <div className="p-4 text-gray-400">No tasks to display</div>;
}

          return (
            <div
              key={task.id}
              className="absolute h-6 bg-blue-400 rounded"
              style={{
                top: index * 30, // ✅ proper stacking (no overlap)
                left: left,
                width: width,
              }}
            >
              <span className="text-xs text-white px-1">
                {task.title}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}