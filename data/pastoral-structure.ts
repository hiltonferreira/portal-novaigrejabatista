import { churchCellsMock, genesisCellMock } from "@/data/cell";

export type PastoralPerson = { id: string; name: string };

export const pastoralPeopleMock: readonly PastoralPerson[] = [
  { id: "person-rafael-souza", name: genesisCellMock.leadership.find((item) => item.role === "Líder")!.name },
  { id: "person-maria-oliveira", name: genesisCellMock.leadership.find((item) => item.role === "Líder em Treinamento")!.name },
  { id: "person-jonathan", name: "Jonathan" },
  { id: "person-wiriquis", name: "Wiriquis" },
  { id: "person-priscila-andrade", name: "Priscila Andrade" },
  { id: "person-daniel-ferreira", name: "Daniel Ferreira" },
];

export const pastoralCellsMock = churchCellsMock;

export const pastoralSupervisionsMock = [
  { id: "supervision-jonathan", supervisorId: "person-jonathan", ledCellId: "cell-a-forja", supervisedLeaderIds: ["person-rafael-souza"] },
  { id: "supervision-wiriquis", supervisorId: "person-wiriquis", ledCellId: "cell-betel", supervisedLeaderIds: ["person-priscila-andrade"] },
] as const;

export const pastoralCoordinationsMock = [
  { id: "coordination-central", name: "Coordenação Central", coordinatorId: "person-daniel-ferreira", supervisionIds: ["supervision-jonathan", "supervision-wiriquis"] },
] as const;

export const pastoralMultiplicationsMock = [
  { id: "multiplication-genesis-a-forja", parentCellId: "cell-genesis", childCellId: "cell-a-forja", occurredOn: "2024-03-18", state: "Efetivada" as const },
  { id: "multiplication-a-forja-kairos", parentCellId: "cell-a-forja", childCellId: "cell-kairos", occurredOn: "2026-06-01", state: "Efetivada" as const },
  { id: "multiplication-genesis-preparation", parentCellId: "cell-genesis", startedOn: "2026-08-20", state: "Em preparação" as const, description: "A Gênesis está se preparando para uma nova multiplicação." },
] as const;

export function getPastoralPerson(personId: string) { return pastoralPeopleMock.find((person) => person.id === personId); }
export function getPastoralCell(cellId: string) { return pastoralCellsMock.find((cell) => cell.id === cellId); }
