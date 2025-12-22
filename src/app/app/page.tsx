"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { addTask, listenTasks, updateTaskStatus } from "@/lib/tasks";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useRemoteFlags } from "@/hooks/useRemoteFlags";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { BoardSkeleton } from "@/components/BoardSkeleton";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Column } from "@/components/Column";
import { TaskCard } from "@/components/TaskCard";
import { usePresence } from "@/hooks/usePresence";
import { auth } from "@/lib/firebase.client";

export default function AppPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { maintenance, flagsLoading } = useRemoteFlags();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
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
    const unsub = listenTasks(user.uid, (newTasks) => {
      setTasks(newTasks);
      setTasksLoading(false);
    });
    return () => unsub();
  }, [user]);

  const counts = useMemo(() => {
    const c: Record<TaskStatus, number> = { todo: 0, doing: 0, done: 0 };
    for (const t of tasks) {
      if (Object.prototype.hasOwnProperty.call(c, t.status)) {
        c[t.status]++;
      }
    }
    return c;
  }, [tasks]);

  const { onlineCount } = usePresence(
    user ? { uid: user.uid, email: user.email } : null
  );

  if (loading) return <BoardSkeleton />;
  if (!user) return null;

  if (flagsLoading) return <LoadingSpinner />;
  if (maintenance) return <MaintenanceScreen />;

  if (tasksLoading) return <BoardSkeleton />;

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              IssueFlow
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-neutral-400">
              <span>{user.email}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-400 font-medium">
                  {onlineCount} Online
                </span>
              </div>
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={async () => {
              if (!auth) return;
              await signOut(auth);
              router.push("/login");
            }}
          >
            Çıkış Yap
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {Object.entries(counts).map(([status, count]) => (
            <div
              key={status}
              className="px-4 py-2 rounded-xl border border-white/5 bg-black/20 text-sm font-medium flex items-center gap-2"
            >
              <span className="capitalize text-neutral-400">{status}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">
                {count}
              </span>
            </div>
          ))}
        </div>

        <form
          className="mt-6 flex flex-col md:flex-row gap-3"
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
          <div className="flex-1 relative group">
            <input
              className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-neutral-600"
              placeholder="Yeni bir görev oluştur..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer hover:bg-black/60 transition-colors "
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button
              className="h-12 px-6 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 focus:ring-2 focus:ring-violet-500/50 transition-all shadow-lg shadow-violet-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Ekleniyor..." : "Oluştur"}
            </button>
          </div>
        </form>
      </div>

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

          let targetStatus = over.id as TaskStatus;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full">
          <div id="todo" className="h-full">
            <Column title="To Do" status="todo" tasks={todo} />
          </div>
          <div id="doing" className="h-full">
            <Column title="In Progress" status="doing" tasks={doing} />
          </div>
          <div id="done" className="h-full">
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
