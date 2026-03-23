import { create } from "zustand";
import { tasks as initialTasks, Task, Status } from "../data/seedData";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
updateTaskStatus: (taskId: string, newStatus: Status) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  setTasks: (tasks: Task[]) => set({ tasks }),
updateTaskStatus: (taskId: string, newStatus: Status) =>
  set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ),
  })),
}));