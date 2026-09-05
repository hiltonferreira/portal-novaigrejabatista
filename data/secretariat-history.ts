import { genesisCellMock } from "@/data/cell";
import { genesisPeopleDirectoryMock } from "@/data/secretariat-attendance";
import { secretariatMeetingsMock } from "@/data/secretariat-meetings";

export type SecretariatHistoryEventType =
  | "attendance-registered"
  | "report-sent-to-leader"
  | "report-viewed-by-leader"
  | "snack-organization-created"
  | "snack-organization-updated";

export type SecretariatHistoryEventMock = {
  id: string;
  encounterId: string;
  type: SecretariatHistoryEventType;
  actorPersonId?: string;
  occurredAt?: string;
  detail?: string;
};

export type SecretariatHistoryEvent = {
  id: string;
  type: SecretariatHistoryEventType;
  title: string;
  actor?: {
    personId: string;
    name: string;
    contextualRole: "Secretaria da Célula" | "Líder";
  };
  occurredAt?: string;
  detail?: string;
};

export type SecretariatHistoryEntry = {
  encounterId: string;
  dateIso: string;
  startTime: string;
  title: string;
  events: readonly SecretariatHistoryEvent[];
};

const personIdByName = new Map(genesisPeopleDirectoryMock.map((person) => [person.name, person.id]));
const mariaPersonId = personIdByName.get("Maria Oliveira");
const rafaelPersonId = personIdByName.get("Rafael Souza");

if (!mariaPersonId || !rafaelPersonId) {
  throw new Error("As pessoas demonstrativas do Histórico devem existir no diretório central da célula.");
}

// Timestamps demonstrativos explícitos: representam o momento da ação, nunca o horário do encontro.
export const secretariatHistoryEventsMock: readonly SecretariatHistoryEventMock[] = [
  {
    id: "history-snack-created-2026-09-01",
    encounterId: "genesis-2026-09-01",
    type: "snack-organization-created",
    actorPersonId: mariaPersonId,
    occurredAt: "2026-08-30T18:42:00-04:00",
  },
  {
    id: "history-snack-updated-2026-09-01",
    encounterId: "genesis-2026-09-01",
    type: "snack-organization-updated",
    actorPersonId: mariaPersonId,
    occurredAt: "2026-09-01T18:42:00-04:00",
  },
  {
    id: "history-attendance-2026-09-01",
    encounterId: "genesis-2026-09-01",
    type: "attendance-registered",
    actorPersonId: mariaPersonId,
    occurredAt: "2026-09-01T21:18:00-04:00",
  },
  {
    id: "history-report-sent-2026-09-01",
    encounterId: "genesis-2026-09-01",
    type: "report-sent-to-leader",
    actorPersonId: mariaPersonId,
    occurredAt: "2026-09-01T21:32:00-04:00",
  },
  {
    id: "history-report-viewed-2026-09-01",
    encounterId: "genesis-2026-09-01",
    type: "report-viewed-by-leader",
    actorPersonId: rafaelPersonId,
    occurredAt: "2026-09-02T08:14:00-04:00",
  },
  {
    id: "history-attendance-2026-08-25",
    encounterId: "genesis-2026-08-25",
    type: "attendance-registered",
    actorPersonId: mariaPersonId,
    occurredAt: "2026-08-25T21:18:00-04:00",
  },
  {
    id: "history-report-sent-2026-08-25",
    encounterId: "genesis-2026-08-25",
    type: "report-sent-to-leader",
    actorPersonId: mariaPersonId,
    occurredAt: "2026-08-25T21:32:00-04:00",
  },
] as const;

const eventTitle: Record<SecretariatHistoryEventType, string> = {
  "attendance-registered": "Presença registrada",
  "report-sent-to-leader": "Relatório enviado ao Líder",
  "report-viewed-by-leader": "Relatório visualizado pelo Líder",
  "snack-organization-created": "Organização do lanche registrada",
  "snack-organization-updated": "Organização do lanche atualizada",
};

const contextualRoleByEvent: Record<SecretariatHistoryEventType, "Secretaria da Célula" | "Líder"> = {
  "attendance-registered": "Secretaria da Célula",
  "report-sent-to-leader": "Secretaria da Célula",
  "report-viewed-by-leader": "Líder",
  "snack-organization-created": "Secretaria da Célula",
  "snack-organization-updated": "Secretaria da Célula",
};

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function resolveActor(event: SecretariatHistoryEventMock): SecretariatHistoryEvent["actor"] {
  if (!event.actorPersonId) return undefined;
  const person = genesisPeopleDirectoryMock.find((candidate) => candidate.id === event.actorPersonId);
  if (!person) return undefined;

  const contextualRole = contextualRoleByEvent[event.type];
  const hasContextualRole = genesisCellMock.leadership.some(
    (responsibility) => responsibility.name === person.name && responsibility.role === contextualRole,
  );

  return hasContextualRole ? { personId: person.id, name: person.name, contextualRole } : undefined;
}

function sortEventsByMostRecent(events: readonly SecretariatHistoryEvent[]) {
  return [...events].sort((first, second) => {
    if (!first.occurredAt && !second.occurredAt) return 0;
    if (!first.occurredAt) return 1;
    if (!second.occurredAt) return -1;
    return new Date(second.occurredAt).getTime() - new Date(first.occurredAt).getTime();
  });
}

export function deriveSecretariatHistory(
  today: Date,
  eventRecords: readonly SecretariatHistoryEventMock[] = secretariatHistoryEventsMock,
): SecretariatHistoryEntry[] {
  const todayKey = localDateKey(today);
  const meetings = [...secretariatMeetingsMock.upcoming, ...secretariatMeetingsMock.previous];

  return meetings
    .filter((meeting) => meeting.dateIso <= todayKey)
    .map((meeting) => {
      const events = eventRecords
        .filter((event) => event.encounterId === meeting.id)
        .map((event) => ({
          id: event.id,
          type: event.type,
          title: eventTitle[event.type],
          actor: resolveActor(event),
          occurredAt: event.occurredAt,
          detail: event.detail,
        }));

      return {
        encounterId: meeting.id,
        dateIso: meeting.dateIso,
        startTime: meeting.startTime,
        title: meeting.title,
        events: sortEventsByMostRecent(events),
      };
    })
    .filter((entry) => entry.events.length > 0)
    .sort((first, second) => second.dateIso.localeCompare(first.dateIso));
}
