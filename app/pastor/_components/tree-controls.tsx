import styles from "../pastor.module.css";

export function TreeControls({ onZoomIn, onZoomOut, onFit, label }: { onZoomIn: () => void; onZoomOut: () => void; onFit: () => void; label: string }) {
  return <div className={styles.treeControls} aria-label={label}>
    <div className={styles.zoomControls}>
      <button type="button" aria-label="Aumentar zoom" onClick={onZoomIn}><span aria-hidden="true">+</span></button>
      <button type="button" aria-label="Diminuir zoom" onClick={onZoomOut}><span aria-hidden="true">−</span></button>
    </div>
    <button type="button" className={`${styles.fitControl} action-link secondary`} onClick={onFit}>Ajustar à tela</button>
  </div>;
}
