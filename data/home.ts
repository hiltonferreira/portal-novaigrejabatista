export type CellContext = {
  name: string;
  weekday: string;
  startTime: string;
  address: string;
  mapsUrl: string;
};

export const homeMock: { personName: string; cell: CellContext } = {
  personName: "Maria",
  cell: {
    name: "Gênesis",
    weekday: "terça-feira",
    startTime: "19h40",
    address: "Rua Marabá, Jardim Jorge Teixeira · Ariquemes, RO",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Marab%C3%A1%2C%20Jardim%20Jorge%20Teixeira%2C%20Ariquemes%2C%20RO",
  },
};
