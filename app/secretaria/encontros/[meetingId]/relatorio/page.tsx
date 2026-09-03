import { notFound } from "next/navigation";
import { deriveAttendanceSummary } from "@/data/secretariat-attendance";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { secretariatReportMock } from "@/data/secretariat-report";
import { ReportEditor } from "../_components/report-editor";

export default async function MeetingReportPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting || meetingId !== secretariatReportMock.encounterId || !("study" in meeting) || !meeting.study) notFound();

  const attendance = deriveAttendanceSummary(
    secretariatReportMock.attendanceSource.people,
    secretariatReportMock.attendanceSource.records,
  );

  return (
    <ReportEditor
      meeting={meeting}
      attendance={{
        totalPresent: attendance.totalPresent,
        absent: attendance.absent,
        visitors: attendance.visitors.map((person) => ({ id: person.id, name: person.name })),
      }}
      gathering={secretariatReportMock.gatheringSource.description}
      initialReport={secretariatReportMock}
    />
  );
}
