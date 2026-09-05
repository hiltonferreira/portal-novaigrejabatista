import { genesisPeopleDirectoryMock } from "@/data/secretariat-attendance";

export type SnackPerson = {
  id: string;
  name: string;
};

export type PeopleRotationParticipant = {
  personId: string;
  isResponsible: boolean;
};

type SnackOrganizationBase = {
  encounterId: string;
  dateIso: string;
  startTime: string;
};

export type PeopleRotation = SnackOrganizationBase & {
  type: "peopleRotation";
  participants: readonly PeopleRotationParticipant[];
};

export type CollectiveContribution = SnackOrganizationBase & {
  type: "collectiveContribution";
  purpose: string;
  amountPerPerson: string;
  collectiveParticipation: boolean;
};

export type SnackOrganization = PeopleRotation | CollectiveContribution;

const suppliedNames = [
  "Alinie", "Anderson", "Caine", "André", "Thiago", "Pamilly", "Giselle", "Rodrigo", "Daiane",
  "Gilvan", "Rosângela", "Ícaro", "Mariana", "Kelly", "Nilson", "Mari", "Ivone", "Giovana",
  "Lorena", "Eduardo", "Kauane", "Cris", "Cleiciane", "Roni", "Yolanda", "Eliezer", "Cirça",
  "Hilton", "Jéssica", "Pr Alex", "Pr Sheila", "Gilmar", "Gleyte", "Lucas", "Mazinho",
] as const;

function personIdFromName(name: string) {
  return `person-snack-${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]+/g, "-")}`;
}

const existingPeople: readonly SnackPerson[] = genesisPeopleDirectoryMock.map(({ id, name }) => ({ id, name }));
const existingNames = new Set(existingPeople.map((person) => person.name));

export const snackPeopleMock: readonly SnackPerson[] = [
  ...existingPeople,
  ...suppliedNames.filter((name) => !existingNames.has(name)).map((name) => ({
    id: personIdFromName(name),
    name,
  })),
];

function participants(names: readonly string[], responsibleNames: readonly string[]): PeopleRotationParticipant[] {
  return names.map((name) => ({
    personId: personIdFromName(name),
    isResponsible: responsibleNames.includes(name),
  }));
}

export const septemberSnackOrganizationsMock: readonly SnackOrganization[] = [
  {
    encounterId: "genesis-2026-09-01",
    dateIso: "2026-09-01",
    startTime: "19h40",
    type: "peopleRotation",
    participants: participants(
      ["Alinie", "Anderson", "Caine", "André", "Thiago", "Pamilly", "Giselle", "Rodrigo", "Daiane"],
      ["Caine", "André"],
    ),
  },
  {
    encounterId: "genesis-2026-09-08",
    dateIso: "2026-09-08",
    startTime: "19h40",
    type: "peopleRotation",
    participants: participants(
      ["Gilvan", "Rosângela", "Ícaro", "Mariana", "Kelly", "Nilson", "Mari", "Ivone", "Giovana"],
      ["Ícaro", "Mariana"],
    ),
  },
  {
    encounterId: "genesis-2026-09-15",
    dateIso: "2026-09-15",
    startTime: "19h40",
    type: "peopleRotation",
    participants: participants(
      ["Lorena", "Eduardo", "Kauane", "Cris", "Cleiciane", "Roni", "Yolanda", "Eliezer", "Cirça"],
      ["Kauane", "Cris"],
    ),
  },
  {
    encounterId: "genesis-2026-09-22",
    dateIso: "2026-09-22",
    startTime: "19h40",
    type: "peopleRotation",
    participants: participants(
      ["Hilton", "Jéssica", "Pr Alex", "Pr Sheila", "Gilmar", "Gleyte", "Lucas", "Mazinho"],
      ["Pr Alex", "Pr Sheila"],
    ),
  },
  {
    encounterId: "genesis-2026-09-29",
    dateIso: "2026-09-29",
    startTime: "19h40",
    type: "collectiveContribution",
    purpose: "Comemoração dos aniversariantes do trimestre",
    amountPerPerson: "R$ 8,00",
    collectiveParticipation: true,
  },
];

export function getSnackPerson(personId: string, people: readonly SnackPerson[] = snackPeopleMock) {
  return people.find((person) => person.id === personId);
}

export function getSnackOrganizationByEncounterId(encounterId: string) {
  return septemberSnackOrganizationsMock.find((organization) => organization.encounterId === encounterId);
}

export function getSnackOrganizationSummary(organization: SnackOrganization, people: readonly SnackPerson[] = snackPeopleMock) {
  if (organization.type === "collectiveContribution") {
    return {
      primary: organization.amountPerPerson + " por pessoa",
      secondary: organization.collectiveParticipation ? "Participação de todos" : organization.purpose,
    };
  }

  const responsibleNames = organization.participants
    .filter((participant) => participant.isResponsible)
    .map((participant) => getSnackPerson(participant.personId, people)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    primary: `${organization.participants.length} participantes`,
    secondary: responsibleNames.length > 0
      ? `${new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" }).format(responsibleNames)} ${responsibleNames.length === 1 ? "responsável" : "responsáveis"}`
      : "Nenhum responsável definido",
  };
}
