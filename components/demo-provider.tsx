"use client";

import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { pastoralStudiesMock, studySchedulesMock, resolveStudyForEncounter, type PastoralStudy, type StudySchedule } from "@/data/pastoral-studies";
import { genesisPeopleDirectoryMock, genesisAttendanceMock, type AttendancePerson, type EncounterAttendance } from "@/data/secretariat-attendance";
import { getSecretariatMeetingById, secretariatMeetingsMock, type SecretariatMeeting } from "@/data/secretariat-meetings";
import { reportStatusPresentation, type ReportStatus } from "@/data/secretariat-report";

export type Narrative = { meetingSummary: string; prayerAndFollowUp: string; observations: string };
export type EncounterOperation = {
  people: AttendancePerson[]; records: EncounterAttendance[]; attendanceSaved: boolean;
  narrative: Narrative; status: ReportStatus;
  snapshot?: { people: AttendancePerson[]; records: EncounterAttendance[]; narrative: Narrative; studyTitle: string };
};
export function initialOperation(id: string): EncounterOperation {
  return { people: [...genesisPeopleDirectoryMock],
    records: id === genesisAttendanceMock.encounterId ? genesisAttendanceMock.records.map(record => ({...record})) : [],
    attendanceSaved: false, narrative: { meetingSummary: "", prayerAndFollowUp: "", observations: "" }, status: "draft" };
}
type DemoState = {
  studies: PastoralStudy[]; setStudies: Dispatch<SetStateAction<PastoralStudy[]>>;
  schedules: StudySchedule[]; setSchedules: Dispatch<SetStateAction<StudySchedule[]>>;
  created: SecretariatMeeting[]; setCreated: Dispatch<SetStateAction<SecretariatMeeting[]>>;
  operations: Record<string, EncounterOperation>; setOperations: Dispatch<SetStateAction<Record<string, EncounterOperation>>>;
  sessionObjectUrls: React.RefObject<Set<string>>;
};
const DemoContext = createContext<DemoState | null>(null);
export function DemoProvider({children}: {children: React.ReactNode}) {
  const [studies, setStudies] = useState<PastoralStudy[]>([...pastoralStudiesMock]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([...studySchedulesMock]);
  const [created, setCreated] = useState<SecretariatMeeting[]>([]);
  const [operations, setOperations] = useState<Record<string, EncounterOperation>>({});
  const sessionObjectUrls = useRef(new Set<string>());
  useEffect(() => { const urls = sessionObjectUrls.current; return () => urls.forEach(url => URL.revokeObjectURL(url)); }, []);
  return <DemoContext.Provider value={{studies, setStudies, schedules, setSchedules, created, setCreated, operations, setOperations, sessionObjectUrls}}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider ausente");
  return context;
}
export function useEncounterOperation(id: string) {
  const {operations, setOperations} = useDemo();
  const operation = operations[id] ?? initialOperation(id);
  function update(change: (current: EncounterOperation) => EncounterOperation) {
    setOperations(current => ({...current, [id]: change(current[id] ?? initialOperation(id))}));
  }
  return {operation, update};
}
export function useMeeting(id: string) {
  const {studies, schedules, created, operations} = useDemo();
  const base = created.find(item => item.id === id) ?? getSecretariatMeetingById(id);
  if (!base) return undefined;
  const study = resolveStudyForEncounter(base.dateIso, studies, schedules);
  const operation = operations[id];
  return {...base, title: study?.title ?? "Estudo a definir", studyPending: !study,
    study: study ? {lessonNumber: `Lição ${study.lessonNumber}`, bibleReference: study.baseReference} : undefined,
    statuses: {...base.statuses, ...(operation ? {
      attendance: {label: operation.attendanceSaved ? "Registrada" : "Em registro", tone: operation.attendanceSaved ? "success" as const : "progress" as const},
      report: reportStatusPresentation[operation.status],
    } : {})}};
}
export function useDemoMeetings() {
  const {created} = useDemo();
  return [...secretariatMeetingsMock.upcoming, ...secretariatMeetingsMock.previous, ...created];
}
