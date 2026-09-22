import { notFound } from "next/navigation";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { AttendanceRegister } from "../_components/attendance-register";
export default async function MeetingAttendancePage({params}: {params: Promise<{meetingId: string}>}) {
  const {meetingId} = await params;
  if (!getSecretariatMeetingById(meetingId)) notFound();
  return <AttendanceRegister key={meetingId} meetingId={meetingId} />;
}
