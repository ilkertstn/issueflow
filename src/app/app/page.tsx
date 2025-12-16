"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { addTask, listenTasks, updateTaskStatus } from "@/lib/tasks";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Column } from "@/components/Column";
import { TaskCard } from "@/components/TaskCard";
import { usePresence } from "@/hooks/usePresence";

export default function AppPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  const todo = tasks.filter((t) => t.status === "todo");
  const doing = tasks.filter((t) => t.status === "doing");
  const done = tasks.filter((t) => t.status === "done");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = listenTasks(user.uid, setTasks);
    return () => unsub();
  }, [user]);

  const counts = useMemo(() => {
    const c: Record<TaskStatus, number> = { todo: 0, doing: 0, done: 0 };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  const { onlineCount } = usePresence(
    user ? { uid: user.uid, email: user.email } : null
  );

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">TaskBoard</h1>
          <p className="text-sm opacity-70">
            Giriş yapan: {user.email} • 🟢 Online: {onlineCount}
          </p>{" "}
        </div>

        <button
          className="rounded-xl border px-4 py-2"
          onClick={async () => {
            await signOut(auth);
            router.push("/login");
          }}
        >
          Çıkış
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full border px-3 py-1">
          Todo: {counts.todo}
        </span>
        <span className="rounded-full border px-3 py-1">
          Doing: {counts.doing}
        </span>
        <span className="rounded-full border px-3 py-1">
          Done: {counts.done}
        </span>
      </div>

      <form
        className="mt-6 flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          setSaving(true);
          try {
            await addTask(user.uid, title.trim(), priority);
            setTitle("");
            setPriority("medium");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border p-3"
            placeholder="Yeni task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="rounded-xl border p-3 bg-transparent"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="rounded-xl border px-4" disabled={saving}>
            {saving ? "..." : "Ekle"}
          </button>
        </div>
      </form>

      <DndContext
        sensors={sensors}
        onDragStart={(event) => {
          setActiveId(event.active.id as string);
        }}
        onDragEnd={async (event: DragEndEvent) => {
          const { active, over } = event;
          setActiveId(null);
          if (!over) return;

          const draggedTask = tasks.find((t) => t.id === active.id);
          if (!draggedTask) return;

          // If dropped on a column (status)
          let targetStatus = over.id as TaskStatus;

          // If dropped on another task, find that task's status
          if (!["todo", "doing", "done"].includes(targetStatus)) {
            const overTask = tasks.find((t) => t.id === over.id);
            if (overTask) {
              targetStatus = overTask.status;
            }
          }

          if (draggedTask.status === targetStatus) return;

          await updateTaskStatus(draggedTask.id, targetStatus);
        }}
      >
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div id="todo">
            <Column title="Todo" status="todo" tasks={todo} />
          </div>
          <div id="doing">
            <Column title="Doing" status="doing" tasks={doing} />
          </div>
          <div id="done">
            <Column title="Done" status="done" tasks={done} />
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard task={tasks.find((t) => t.id === activeId)!} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
