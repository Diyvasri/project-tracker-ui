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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        p-3 rounded-xl h-[500px] overflow-y-auto min-w-[250px]
        transition-all duration-200 ease-in-out
        ${
          isOver
            ? "bg-blue-50 border-2 border-blue-400 shadow-inner"
            : "bg-gray-50 border border-gray-200"
        }
      `}
      onPointerUp={() => {
        if (draggingTask) {
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
      {/* TITLE */}
      <h3 className="font-semibold text-gray-700 mb-3">
        {title} ({tasks.length})
      </h3>

      {/* 🔥 IMPROVED EMPTY STATE */}
      {tasks.length === 0 && (
        <div className="text-center text-gray-400 py-10 text-sm">
          📭 No tasks yet — drag or create one!
        </div>
      )}

      {/* TASKS */}
      {tasks.map((task: any, index: number) => {
        const usersOnTask =
          activeUsers?.filter((u: any) => u.taskId === task.id) || [];

        const isDragging = draggingTask?.id === task.id;

        const cardElement = document.getElementById(`card-${task.id}`);
        const cardHeight = cardElement?.offsetHeight;

        return (
          <motion.div
            key={task.id}
            layout
            transition={{ duration: 0.25 }}
            onPointerEnter={() => setHoverIndex(index)}
          >
            {/* DROP LINE */}
            {hoverIndex === index && draggingTask && !isDragging && (
              <motion.div
                layout
                className="h-1 bg-blue-500 rounded my-1"
              />
            )}

            {/* PLACEHOLDER */}
            {isDragging && cardHeight && (
              <motion.div
                layout
                className="bg-gray-300 mb-2 rounded"
                style={{ height: cardHeight }}
              />
            )}

            {/* CARD */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <KanbanCard
                task={task}
                draggingTask={draggingTask}
                setDraggingTask={setDraggingTask}
                setPosition={setPosition}
                usersOnTask={usersOnTask}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* DROP END */}
      {hoverIndex === tasks.length && draggingTask && (
        <motion.div
          layout
          className="h-1 bg-blue-500 rounded my-1"
        />
      )}
    </motion.div>
  );
}

export default KanbanColumn;