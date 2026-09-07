export type DiscipleshipGroup = {
  id: string;
  name: string;
  leaderName: string;
  leaderRole: "Pastor" | "Supervisor";
  networkName: string;
  networkCells: readonly string[];
  participants: readonly { name: string; role: "Líder" | "Líder em Treinamento"; cellName: string }[];
  studies: readonly { title: string; source: "Pastoral" | "Próprio grupo" }[];
  status: "Ativo" | "Encerrado";
};

export const discipleshipGroupsMock: readonly DiscipleshipGroup[] = [
  {
    id: "discipleship-genesis",
    name: "Grupo de Discipulado · Rede Gênesis",
    leaderName: "Jonathan",
    leaderRole: "Supervisor",
    networkName: "Rede Gênesis",
    networkCells: ["Gênesis", "A Forja"],
    participants: [
      { name: "Rafael", role: "Líder", cellName: "Gênesis" },
      { name: "Maria Oliveira", role: "Líder em Treinamento", cellName: "Gênesis" },
    ],
    studies: [{ title: "Fundamentos de uma liderança que cuida", source: "Pastoral" }],
    status: "Ativo",
  },
];
