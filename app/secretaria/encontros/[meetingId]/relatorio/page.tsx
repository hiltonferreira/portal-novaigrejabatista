import { notFound } from "next/navigation";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { ReportEditor } from "../_components/report-editor";
export default async function MeetingReportPage({params}: {params: Promise<{meetingId: string}>}) {
  const {meetingId} = await params;
  if (!getSecretariatMeetingById(meetingId)) notFound();
  return <ReportEditor key={meetingId} meetingId={meetingId} />;
}
