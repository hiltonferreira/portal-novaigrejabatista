import { genesisCellMock } from "@/data/cell";

export type AttendanceState = "unregistered" | "present" | "absent";

export type AttendancePerson = {
  id: string;
  name: string;
  churchRelationship: "Membro" | "Frequentador" | "Visitante";
  churchRelationshipLabel: string;
  cellRoles: readonly string[];
  whatsapp?: string;
};

export type EncounterAttendance = {
  personId: string;
  state: AttendanceState;
  invitedByPersonId?: string;
};

const personIdsByName: Record<string, string> = {
  "Ana Martins": "person-ana-martins",
  "Beatriz Almeida": "person-beatriz-almeida",
  "Carolina Mendes": "person-carolina-mendes",
  "Juliana Rocha": "person-juliana-rocha",
  "Lucas Ferreira": "person-lucas-ferreira",
  "Maria Oliveira": "person-maria-oliveira",
  "Marcos Vinícius Costa": "person-marcos-vinicius-costa",
  "Pedro Almeida": "person-pedro-almeida",
  "Rafael Souza": "person-rafael-souza",
};

export const genesisPeopleDirectoryMock: AttendancePerson[] = genesisCellMock.participants.map((person) => ({
  id: personIdsByName[person.name],
  name: person.name,
  churchRelationship: person.churchRelationship,
  churchRelationshipLabel: person.churchRelationshipLabel,
  cellRoles: person.cellRoles,
  whatsapp: person.name === "Marcos Vinícius Costa" ? "(69) 9XXXX-0001" : undefined,
}));

export const genesisAttendanceMock = {
  encounterId: genesisCellMock.nextMeeting.id,
  people: genesisPeopleDirectoryMock,
  records: [
    { personId: "person-ana-martins", state: "present" },
    { personId: "person-beatriz-almeida", state: "absent" },
    { personId: "person-carolina-mendes", state: "present" },
    { personId: "person-juliana-rocha", state: "unregistered" },
    { personId: "person-lucas-ferreira", state: "present" },
    { personId: "person-maria-oliveira", state: "present" },
    { personId: "person-marcos-vinicius-costa", state: "present", invitedByPersonId: "person-maria-oliveira" },
    { personId: "person-pedro-almeida", state: "absent" },
    { personId: "person-rafael-souza", state: "present" },
  ],
} as const satisfies {
  encounterId: string;
  people: readonly AttendancePerson[];
  records: readonly EncounterAttendance[];
};

export function deriveAttendanceSummary(people: readonly AttendancePerson[], records: readonly EncounterAttendance[]) {
  const recordByPersonId = new Map(records.map((record) => [record.personId, record]));
  const presentPeople = people.filter((person) => recordByPersonId.get(person.id)?.state === "present");
  const visitors = presentPeople.filter((person) => person.churchRelationship === "Visitante");

  return {
    knownPresent: presentPeople.length - visitors.length,
    absent: records.filter((record) => record.state === "absent").length,
    visitors,
    totalPresent: presentPeople.length,
  };
}
