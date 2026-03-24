import { useState } from "react";
import KanbanCard from "./KanbanCard";
import { motion } from "framer-motion";

function KanbanColumn({
  title,
  status,
  tasks,
  onDrop,
  draggingTask,
  setDraggingTask,
  setPosition,
  activeUsers,
}: any) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isOver = draggingTask !== null;

  return (
    <div
      className={`
        p-3 rounded-xl h-[500px] overflow-auto scroll-smooth
        transition-all duration-200 ease-in-out
        ${
          isOver
            ? "bg-blue-50 border-2 border-blue-400 shadow-inner"
            : "bg-gray-50 border border-gray-200"
        }
      `}
      onPointerUp={() => {
        if (draggingTask) {
          // 🔥 SNAP EFFECT
          setTimeout(() => {
            onDrop(status, hoverIndex);
            setHoverIndex(null);
          }, 50);
        }
      }}
      onPointerMove={(e) => {
        if (draggingTask) {
          setPosition({ x: e.clientX, y: e.clientY });
        }
      }}
      onPointerLeave={() => setHoverIndex(null)}
    >
      {/* 🔹 Title */}
      <h3 className="font-semibold text-gray-700 mb-3">
        {title} ({tasks.length})
      </h3>

      {/* 🔹 Empty State */}
      {tasks.length === 0 && (
        <div className="text-center text-gray-400 py-10 text-sm">
          🚀 No tasks here. Start by adding one!
        </div>
      )}

      {/* 🔹 Tasks */}
      {tasks.map((task: any, index: number) => {
        const usersOnTask =
          activeUsers?.filter((u: any) => u.taskId === task.id) || [];

        const isDragging = draggingTask?.id === task.id;

        const cardElement = document.getElementById(`card-${task.id}`);
        const cardHeight = cardElement?.offsetHeight;

        return (
          <motion.div
            key={task.id}
            layout // 🔥 MAIN MAGIC (smooth reorder)
            transition={{ duration: 0.25 }}
            onPointerEnter={() => setHoverIndex(index)}
          >
            {/* 🔥 PRECISE DROP LINE */}
            {hoverIndex === index && draggingTask && !isDragging && (
              <motion.div
                layout
                className="h-1 bg-blue-500 rounded my-1"
              />
            )}

            {/* 🔥 PLACEHOLDER */}
            {isDragging && cardHeight && (
              <motion.div
                layout
                className="bg-gray-300 mb-2 rounded"
                style={{ height: cardHeight }}
              />
            )}

            {/* 🔹 Card */}
            <KanbanCard
              task={task}
              draggingTask={draggingTask}
              setDraggingTask={setDraggingTask}
              setPosition={setPosition}
              usersOnTask={usersOnTask}
            />
          </motion.div>
        );
      })}

      {/* 🔥 DROP AT END */}
      {hoverIndex === tasks.length && draggingTask && (
        <motion.div
          layout
          className="h-1 bg-blue-500 rounded my-1"
        />
      )}
    </div>
  );
}

export default KanbanColumn;