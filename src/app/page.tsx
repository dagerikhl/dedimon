import { Card } from "@/common/components/layout/Card";
import { Log } from "@/features/log/components/Log";
import { State } from "@/features/state/components/State";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <Card className={styles.state} heading="State">
        <State />
      </Card>

      <Card className={styles.info} heading="Info">
        TODO Add info
      </Card>

      <Card className={styles.config} heading="Config">
        TODO Add config
      </Card>

      <Card className={styles.log} heading="Log" noPadding>
        <Log />
      </Card>
    </main>
  );
}
