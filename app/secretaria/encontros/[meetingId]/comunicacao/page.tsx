import { notFound } from "next/navigation";
import { getSecretariatMeetingById, secretariatCommunicationMock } from "@/data/secretariat-meetings";
import { CommunicationEditor } from "../_components/communication-editor";

export default async function MeetingCommunicationPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting) notFound();
  if (meetingId !== secretariatCommunicationMock.encounterId || !("study" in meeting) || !meeting.study) notFound();

  return (
    <CommunicationEditor
      meeting={meeting}
      serviceAssignments={meeting.serviceAssignments ?? []}
      communication={secretariatCommunicationMock}
    />
  );
}
