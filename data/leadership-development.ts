export const traineeLeadersMock = [
  {
    id: "trainee-maria-oliveira",
    personId: "person-maria-oliveira",
    personName: "Maria Oliveira",
    cellId: "cell-genesis",
    cellName: "Gênesis",
    designatedOn: "2026-04-12",
    journey: {
      completedModules: 3,
      totalModules: 4,
      currentModule: "Formação DNA",
    },
  },
] as const;

export const leadershipDesignationCandidatesMock = [
  {
    id: "person-lucas-ferreira",
    name: "Lucas Ferreira",
    cellId: "cell-genesis",
    cellName: "Gênesis",
    journeyLabel: "Jornada DNA iniciada",
  },
  {
    id: "person-carolina-mendes",
    name: "Carolina Mendes",
    cellId: "cell-genesis",
    cellName: "Gênesis",
    journeyLabel: "Jornada DNA iniciada",
  },
] as const;
