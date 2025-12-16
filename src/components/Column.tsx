"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";

export function Column({
  title,
  status,
  tasks,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-4 w-full">
      <h3 className="font-semibold">{title}</h3>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-[60px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
