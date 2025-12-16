"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function AppPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">TaskBoard</h1>
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

      <p className="mt-4 text-sm opacity-70">Giriş yapan: {user.email}</p>

      <div className="mt-8 rounded-2xl border p-6">
        Firestore task CRUD bir sonraki adım ✅
      </div>
    </main>
  );
}
