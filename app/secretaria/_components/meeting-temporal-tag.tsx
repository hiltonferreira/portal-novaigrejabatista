"use client";

import { useSyncExternalStore } from "react";
import { ContextTag } from "@/components/portal-patterns";
import { formatDayMonthTag, getTemporalContext } from "@/data/temporal-context";

const subscribeToBrowser = () => () => undefined;

export function MeetingTemporalTag({ dateIso }: { dateIso: string }) {
  const browserIsReady = useSyncExternalStore(subscribeToBrowser, () => true, () => false);
  const label = browserIsReady ? getTemporalContext(dateIso, new Date()) : null;

  return <ContextTag>{label ?? formatDayMonthTag(dateIso)}</ContextTag>;
}
