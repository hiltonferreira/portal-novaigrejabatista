import { notFound } from "next/navigation";
import { getSecretariatMeetingById, secretariatCommunicationMock } from "@/data/secretariat-meetings";
import { CommunicationEditor } from "../_components/communication-editor";
import { NewMeetingOperationState } from "../_components/new-meeting-operation-state";

export default async function MeetingCommunicationPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting) notFound();
  if (meetingId !== secretariatCommunicationMock.encounterId) return <NewMeetingOperationState operation="Comunicação" />;
  if (!meeting.study) notFound();

  return (
    <CommunicationEditor
      meeting={{ ...meeting, study: meeting.study }}
      serviceAssignments={meeting.serviceAssignments ?? []}
      communication={secretariatCommunicationMock}
    />
  );
}
