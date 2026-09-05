export const TRAINEE_STORAGE_KEY = "nib.portal.trainee-leaders.v1";
export const MULTIPLICATION_STORAGE_KEY = "nib.portal.multiplications.v1";

export type StoredTraineeLeader = {
  id: string;
  personId: string;
  personName: string;
  cellId: string;
  cellName: string;
  designatedOn: string;
  journey: { completedModules: number; totalModules: number; currentModule: string };
};

export type StoredMultiplicationPreparation = {
  id: string;
  parentCellId: string;
  startedOn: string;
  startedBy: string;
  state: "Em preparação";
  description: string;
  expectedDate?: string;
  notes?: string;
  futureName?: string;
  futureLeaderId?: string;
  weekday?: string;
  time?: string;
  location?: string;
  host?: string;
  people?: string[];
};

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readStoredTrainees() { return readArray<StoredTraineeLeader>(TRAINEE_STORAGE_KEY); }
export function writeStoredTrainees(value: StoredTraineeLeader[]) { writeArray(TRAINEE_STORAGE_KEY, value); }
export function readStoredPreparations() { return readArray<StoredMultiplicationPreparation>(MULTIPLICATION_STORAGE_KEY); }
export function writeStoredPreparations(value: StoredMultiplicationPreparation[]) { writeArray(MULTIPLICATION_STORAGE_KEY, value); }
