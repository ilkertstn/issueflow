import { Timestamp } from "firebase/firestore";

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  uid: string;
  createdAt: Timestamp;
};

export type PresenceUser = {
  uid: string;
  email: string | null;
  online: boolean;
  lastSeen?: number | object;
};
