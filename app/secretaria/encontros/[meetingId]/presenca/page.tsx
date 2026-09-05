import { notFound } from "next/navigation";
import { genesisAttendanceMock } from "@/data/secretariat-attendance";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { AttendanceRegister } from "../_components/attendance-register";
import { NewMeetingOperationState } from "../_components/new-meeting-operation-state";

export default async function MeetingAttendancePage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting) notFound();
  if (meetingId !== genesisAttendanceMock.encounterId) return <NewMeetingOperationState operation="Presença" />;

  return <AttendanceRegister initialPeople={genesisAttendanceMock.people} initialRecords={genesisAttendanceMock.records} />;
}
