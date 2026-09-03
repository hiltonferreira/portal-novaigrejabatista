import { genesisCellMock, type CellContext } from "@/data/cell";

type HomeMock = {
  personName: string;
  responsibilities: readonly string[];
  cell: CellContext;
};

export const homeMock: HomeMock = {
  personName: "Maria",
  responsibilities: ["Liderança", "Secretaria da Célula"],
  cell: genesisCellMock,
};
