import { Card } from "@/common/components/layout/Card";
import { Configs } from "@/features/config/components/Configs";
import { Info } from "@/features/info/components/Info";
import { Log } from "@/features/log/components/Log";
import { State } from "@/features/state/components/State";
import { UptimeGfx } from "@/modules/uptime-gfx/components/UptimeGfx";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <Card className={styles.state} heading="State" omitFullscreen>
        <State />
      </Card>

      <Card
        className={styles.status}
        heading="Status (logs/minute the last hour)"
      >
        <UptimeGfx />
      </Card>

      <Card className={styles.info} heading="Info">
        <Info />
      </Card>

      <Card className={styles.config} heading="Config">
        <Configs />
      </Card>

      <Card className={styles.log} heading="Log" noPadding>
        <Log />
      </Card>
    </main>
  );
}
