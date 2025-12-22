import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase.client";
import { Task, TaskPriority, TaskStatus } from "@/types/task";

export function listenTasks(uid: string, cb: (tasks: Task[]) => void) {
  const q = query(
    collection(db, "tasks"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const tasks: Task[] = snap.docs.map((d) => {
      const data = d.data() as Omit<Task, "id">;
      return { id: d.id, ...data };
    });
    cb(tasks);
  });
}

export async function addTask(
  uid: string,
  title: string,
  priority: TaskPriority = "medium"
) {
  await addDoc(collection(db, "tasks"), {
    uid,
    title,
    status: "todo",
    priority,
    createdAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  await updateDoc(doc(db, "tasks", taskId), data);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  await updateDoc(doc(db, "tasks", taskId), { status });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId));
}
