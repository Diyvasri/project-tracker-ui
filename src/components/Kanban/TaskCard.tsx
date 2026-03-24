type TaskCardProps = {
  task: any;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
};

const TaskCard = ({ task, isDragging, onPointerDown }: TaskCardProps) => {
  return (
    <div
      onPointerDown={onPointerDown}
      className="bg-white rounded-lg p-3 mb-3 shadow-sm cursor-grab"
      style={{
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging
          ? "0 8px 20px rgba(0,0,0,0.2)"
          : "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{task.title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-red-200">
          {task.priority}
        </span>
      </div>

      <div className="text-sm mt-2 text-gray-500">
        {task.assignee}
      </div>

      <div className="text-xs mt-1 text-red-500">
        {task.dueDate}
      </div>
    </div>
  );
};

export default TaskCard;