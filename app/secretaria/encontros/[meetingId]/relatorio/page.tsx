import { notFound } from "next/navigation";
import { deriveAttendanceSummary } from "@/data/secretariat-attendance";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { secretariatReportMock } from "@/data/secretariat-report";
import { getSnackOrganizationSummary } from "@/data/snack-organization";
import { ReportEditor } from "../_components/report-editor";
import { NewMeetingOperationState } from "../_components/new-meeting-operation-state";

export default async function MeetingReportPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting) notFound();
  if (meetingId !== secretariatReportMock.encounterId) return <NewMeetingOperationState operation="Relatório" />;
  if (!meeting.study || !secretariatReportMock.snackOrganizationSource) notFound();

  const attendance = deriveAttendanceSummary(
    secretariatReportMock.attendanceSource.people,
    secretariatReportMock.attendanceSource.records,
  );
  const gathering = getSnackOrganizationSummary(secretariatReportMock.snackOrganizationSource);

  return (
    <ReportEditor
      meeting={{ ...meeting, study: meeting.study }}
      attendance={{
        totalPresent: attendance.totalPresent,
        absent: attendance.absent,
        visitors: attendance.visitors.map((person) => ({ id: person.id, name: person.name })),
      }}
      gathering={gathering}
      initialReport={secretariatReportMock}
    />
  );
}
