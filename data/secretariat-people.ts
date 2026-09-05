import { genesisCellMock } from "@/data/cell";
import {
  genesisAttendanceMock,
  genesisPeopleDirectoryMock,
  type AttendancePerson,
  type EncounterAttendance,
} from "@/data/secretariat-attendance";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";

const nameCollator = new Intl.Collator("pt-BR", { sensitivity: "base" });

export const secretariatPeopleMock = [...genesisPeopleDirectoryMock]
  .toSorted((first, second) => nameCollator.compare(first.name, second.name));

export const secretariatPeopleSummary = {
  total: secretariatPeopleMock.length,
  visitors: secretariatPeopleMock.filter((person) => person.churchRelationship === "Visitante").length,
};

type AttendanceSnapshot = {
  encounterId: string;
  records: readonly EncounterAttendance[];
};

type MeetingReference = {
  id: string;
  dateIso: string;
};

export function deriveVisitorParticipation(
  people: readonly AttendancePerson[],
  attendanceSnapshots: readonly AttendanceSnapshot[],
  meetings: readonly MeetingReference[],
) {
  const personById = new Map(people.map((person) => [person.id, person]));
  const meetingById = new Map(meetings.map((meeting) => [meeting.id, meeting]));

  return people
    .filter((person) => person.churchRelationship === "Visitante")
    .map((person) => {
      const participations = attendanceSnapshots
        .flatMap((snapshot) => {
          const record = snapshot.records.find((candidate) => candidate.personId === person.id && candidate.state === "present");
          const meeting = meetingById.get(snapshot.encounterId);
          return record && meeting ? [{ record, meeting }] : [];
        })
        .toSorted((first, second) => first.meeting.dateIso.localeCompare(second.meeting.dateIso));
      const lastParticipation = participations.at(-1);
      const invitation = participations.find(({ record }) => record.invitedByPersonId)?.record;
      const invitedBy = invitation?.invitedByPersonId ? personById.get(invitation.invitedByPersonId) : undefined;

      return {
        id: person.id,
        name: person.name,
        invitedByName: invitedBy?.name,
        participationCount: participations.length,
        lastParticipationDateIso: lastParticipation?.meeting.dateIso,
      };
    });
}

const currentAttendanceMeeting = getSecretariatMeetingById(genesisAttendanceMock.encounterId);

export const secretariatVisitorsMock = deriveVisitorParticipation(
  secretariatPeopleMock,
  [genesisAttendanceMock],
  currentAttendanceMeeting ? [currentAttendanceMeeting] : [],
);

export const secretariatBirthdaysMock = genesisCellMock.birthdays;

export function getUpcomingBirthdays<T extends { dateLabel: string }>(birthdays: readonly T[], today: Date) {
  function nextOccurrence(dateLabel: string) {
    const [day, month] = dateLabel.split("/").map(Number);
    const occurrence = new Date(today.getFullYear(), month - 1, day);
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (occurrence < localToday) occurrence.setFullYear(occurrence.getFullYear() + 1);
    return occurrence.getTime();
  }

  return [...birthdays].toSorted((first, second) =>
    nextOccurrence(first.dateLabel) - nextOccurrence(second.dateLabel));
}
