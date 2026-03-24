import { useState } from "react";
import { useTaskStore } from "../../context/TaskStore";
import { motion } from "framer-motion";

export default function TimelineView() {
  const tasks = useTaskStore((state) => state.tasks);

  const startOfMonth = new Date(2026, 2, 1);
  const [scale, setScale] = useState(40);

  const today = new Date();
  const todayIndex =
    (today.getTime() - startOfMonth.getTime()) / 86400000;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-400";
      case "In Progress":
        return "bg-blue-500";
      case "In Review":
        return "bg-yellow-400";
      case "Done":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-4 text-gray-400 text-center">
        📭 No tasks yet — your timeline will appear here!
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* LEGEND */}
      <div className="flex gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-400 inline-block"></span> To Do
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-500 inline-block"></span> In Progress
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-400 inline-block"></span> In Review
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 inline-block"></span> Done
        </div>
      </div>

      {/* ZOOM */}
      <div className="mb-3">
        <label className="text-sm mr-2">Zoom:</label>
        <input
          type="range"
          min="20"
          max="100"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />
      </div>

      <div className="overflow-x-auto">
        <div
          style={{ width: "2000px", position: "relative" }}
          className="bg-white rounded-xl shadow-sm"
        >

          {/* GRID */}
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${i * scale}px` }}
            />
          ))}

          {/* TODAY LINE */}
          <div
            className="absolute top-0 w-[2px] bg-red-500 h-full z-10"
            style={{ left: `${todayIndex * scale}px` }}
          />

          {/* TASK ROWS */}
          {tasks.map((task) => {
            const startDate = new Date(task.startDate || task.dueDate);
            const endDate = new Date(task.dueDate);

            const startOffset =
              ((startDate.getTime() - startOfMonth.getTime()) /
                86400000) *
              scale;

            const duration =
              ((endDate.getTime() - startDate.getTime()) /
                86400000 +
                1) *
              scale;

            return (
              <div
                key={task.id}
                className="relative h-10 border-b border-gray-200"
              >
                <div
                  className="absolute"
                  style={{
                    left: `${startOffset}px`,
                    width: `${duration}px`,
                    top: "5px",
                  }}
                >

                  {/* ✅ FINAL TOOLTIP + ANIMATION */}
                  <div className="group relative w-full h-full">

                    {/* TASK BAR */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      transition={{ duration: 0.3 }}
                      className={`${getStatusColor(
                        task.status
                      )} h-6 rounded-xl shadow-sm hover:shadow-md flex items-center px-2 cursor-pointer`}
                    >
                      <span className="text-xs text-white truncate w-full">
                        {task.title}
                      </span>
                    </motion.div>

                    {/* 🔥 PREMIUM TOOLTIP */}
                    <div className="
                      absolute left-1/2 -translate-x-1/2
                      bottom-full mb-2
                      hidden group-hover:flex flex-col
                      bg-gray-900 text-white text-xs
                      rounded-lg px-3 py-2
                      shadow-xl z-50
                      w-56
                      opacity-0 group-hover:opacity-100
                      transition-all duration-200
                    ">

                      <span className="font-semibold mb-1">
                        {task.title}
                      </span>
                      <span>👤 {task.assignee}</span>
                      <span>
                        📅 Start: {new Date(task.startDate || task.dueDate).toLocaleDateString()}
                      </span>
                      <span>
                        🏁 End: {new Date(task.dueDate).toLocaleDateString()}
                      </span>

                      {/* Arrow */}
                      <div className="
                        absolute top-full left-1/2 -translate-x-1/2
                        w-0 h-0
                        border-l-4 border-r-4 border-t-4
                        border-l-transparent border-r-transparent border-t-gray-900
                      "></div>

                    </div>

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}