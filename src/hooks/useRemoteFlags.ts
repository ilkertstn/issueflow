"use client";

import { useEffect, useState } from "react";
import { fetchAndActivate, getBoolean } from "firebase/remote-config";
import { remoteConfig } from "@/lib/firebase.client";

export function useRemoteFlags() {
  const [maintenance, setMaintenance] = useState(false);
  const [flagsLoading, setFlagsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await fetchAndActivate(remoteConfig);
      } catch {
        // sorun olursa defaultConfig devreye girer
      }

      if (!alive) return;

      const value = getBoolean(remoteConfig, "maintenance_mode");
      setMaintenance(value);
      setFlagsLoading(false);

      // debug
      console.log("maintenance_mode:", value);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { maintenance, flagsLoading };
}
