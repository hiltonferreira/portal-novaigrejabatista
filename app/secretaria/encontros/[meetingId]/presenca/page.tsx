import { notFound } from "next/navigation";
import { genesisAttendanceMock } from "@/data/secretariat-attendance";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { AttendanceRegister } from "../_components/attendance-register";

export default async function MeetingAttendancePage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting || meetingId !== genesisAttendanceMock.encounterId) notFound();

  return <AttendanceRegister initialPeople={genesisAttendanceMock.people} initialRecords={genesisAttendanceMock.records} />;
}
