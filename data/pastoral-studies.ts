import { genesisCellMock } from "@/data/cell";
import { getCalendarWeek } from "@/data/temporal-context";

export type PastoralStudy = {
  id: string;
  series: string;
  lessonNumber: string;
  title: string;
  baseReference: string;
  pdf: { fileName: string; objectUrl: string | null };
};

export const pastoralStudiesMock: readonly PastoralStudy[] = [
  {
    id: "study-guided-by-spirit",
    series: "Série demonstrativa",
    lessonNumber: genesisCellMock.nextMeeting.study.lessonNumber.replace(/\D/g, ""),
    title: genesisCellMock.nextMeeting.study.title,
    baseReference: genesisCellMock.nextMeeting.study.bibleReference,
    pdf: { fileName: "licao-13-uma-vida-guiada-pelo-espirito.pdf", objectUrl: null },
  },
  {
    id: "study-romans-08-love-that-holds",
    series: "A Carta aos Romanos – DNA",
    lessonNumber: "08",
    title: "O Amor que Não Solta",
    baseReference: "Romanos 5.1–11",
    pdf: { fileName: "licao-08-o-amor-que-nao-solta.pdf", objectUrl: null },
  },
];

export type StudySchedule = { id: string; studyId: string; weekStart: string };

export const studySchedulesMock: readonly StudySchedule[] = [
  { id: "schedule-2026-09-07", studyId: "study-guided-by-spirit", weekStart: "2026-09-07" },
];

export function resolveStudyForEncounter(
  encounterDateIso: string,
  studies: readonly PastoralStudy[] = pastoralStudiesMock,
  schedules: readonly StudySchedule[] = studySchedulesMock,
) {
  const { weekStart } = getCalendarWeek(encounterDateIso);
  const schedule = schedules.find((candidate) => candidate.weekStart === weekStart);
  return schedule ? studies.find((study) => study.id === schedule.studyId) : undefined;
}

export function createStudyScheduleId() { return `study-schedule-${crypto.randomUUID()}`; }

export function createPastoralStudyId() {
  return `study-${crypto.randomUUID()}`;
}

export function normalizeLessonNumber(value: string) {
  return value.trim().padStart(2, "0");
}
