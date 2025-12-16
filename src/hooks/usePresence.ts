"use client";

import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { PresenceUser } from "@/types/task";

export function usePresence(
  user: { uid: string; email: string | null } | null
) {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const myRef = ref(rtdb, `presence/${user.uid}`);

    // online yaz
    set(myRef, {
      uid: user.uid,
      email: user.email ?? null,
      online: true,
      lastSeen: serverTimestamp(),
    });

    // disconnect olunca offline yaz (kritik)
    onDisconnect(myRef).set({
      uid: user.uid,
      email: user.email ?? null,
      online: false,
      lastSeen: serverTimestamp(),
    });

    // tüm presence’ı dinle → online count
    const allRef = ref(rtdb, "presence");
    const unsub = onValue(allRef, (snap) => {
      const val = snap.val() as Record<string, PresenceUser> | null;
      if (!val) return setOnlineCount(0);

      const count = Object.values(val).filter((u) => u?.online).length;
      setOnlineCount(count);
    });

    return () => unsub();
  }, [user?.uid, user?.email]);

  return { onlineCount };
}
