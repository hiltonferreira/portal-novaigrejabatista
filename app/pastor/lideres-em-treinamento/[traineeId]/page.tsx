import Link from "next/link";
import { traineeLeadersMock } from "@/data/leadership-development";
import type { StoredTraineeLeader } from "@/lib/test-persistence";
import styles from "../../pastor.module.css";
import traineeStyles from "../trainee-leaders.module.css";
import { FollowUpClient } from "./follow-up-client";

export default async function Page({ params }: { params: Promise<{ traineeId: string }> }) {
  const { traineeId } = await params;
  const staticTrainee = traineeLeadersMock.find((item) => item.id === traineeId);
  const initial: StoredTraineeLeader | undefined = staticTrainee ? {
    id: staticTrainee.id,
    personId: staticTrainee.personId,
    personName: staticTrainee.personName,
    cellId: staticTrainee.cellId,
    cellName: staticTrainee.cellName,
    designatedOn: staticTrainee.designatedOn,
    journey: { ...staticTrainee.journey },
  } : undefined;

  return <div className={`${styles.directoryPage} ${traineeStyles.page}`}>
    <Link className={styles.backToOverview} href="/pastor/lideres-em-treinamento">‹ Voltar para Líderes em Treinamento</Link>
    <FollowUpClient traineeId={traineeId} initial={initial} />
  </div>;
}
