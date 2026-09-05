import { SnackOrganizationEditor } from "../_components/snack-organization-editor";
import { septemberSnackOrganizationsMock, snackPeopleMock } from "@/data/snack-organization";
import { secretariatMeetingsMock } from "@/data/secretariat-meetings";
import { genesisCellMock } from "@/data/cell";

export default function SecretariatSnackPage() {
  const encounters = [...secretariatMeetingsMock.previous, ...secretariatMeetingsMock.upcoming]
    .map(({ id, dateIso, startTime }) => ({ id, dateIso, startTime }));

  return (
    <SnackOrganizationEditor
      cellSchedule={{ weekday: genesisCellMock.weekday, startTime: genesisCellMock.startTime }}
      encounters={encounters}
      initialOrganizations={septemberSnackOrganizationsMock}
      people={snackPeopleMock}
    />
  );
}
