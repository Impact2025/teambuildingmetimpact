"use client";

import { useEffect, useRef } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useWorkshopStore } from "@/state/workshop-store";
import type { SyncMessage, WorkshopLiveState } from "@/types/workshop";

type WorkshopRealtimeBridgeProps = {
  workshopId: string;
  initialState: WorkshopLiveState;
  role: "admin" | "viewer";
};

export function WorkshopRealtimeBridge({
  workshopId,
  initialState,
  role,
}: WorkshopRealtimeBridgeProps) {
  const setState = useWorkshopStore((state) => state.setState);
  const updateFromMessage = useWorkshopStore((state) => state.updateFromMessage);
  const setPublisher = useWorkshopStore((state) => state.setPublisher);
  const stateRef = useRef(initialState);

  useEffect(() => {
    setState(initialState);
    stateRef.current = initialState;
  }, [initialState, setState]);

  useEffect(() => {
    let isMounted = true;
    type SupabaseClientType = ReturnType<typeof createSupabaseBrowserClient>;
    let supabaseClient: SupabaseClientType | null = null;
    let channel: ReturnType<SupabaseClientType["channel"]> | null = null;

    const setup = async () => {
      try {
        supabaseClient = createSupabaseBrowserClient();
      } catch (error) {
        console.warn(
          "Supabase niet geconfigureerd, realtime synchronisatie uitgeschakeld.",
          error
        );
        return;
      }

      channel = supabaseClient.channel(`workshop:${workshopId}`);

      channel.on("broadcast", { event: "state" }, ({ payload }) => {
        updateFromMessage(payload as SyncMessage);
      });

      const publish = (message: SyncMessage) => {
        channel?.send({ type: "broadcast", event: "state", payload: message });
        stateRef.current = message.payload;
        setState(message.payload);
      };

      await channel.subscribe();

      if (role === "admin" && isMounted) {
        setPublisher(() => publish);
      }
    };

    setup();

    return () => {
      isMounted = false;
      setPublisher(null);
      if (channel && supabaseClient) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [role, setPublisher, setState, updateFromMessage, workshopId]);

  return null;
}
