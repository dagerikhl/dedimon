import { AdapterBanner } from "@/common/components/banners/AdapterBanner";
import styles from "./PageHeader.module.scss";

export const PageHeader = () => (
  <header className={styles.container}>
    <h1>Dedimon</h1>

    <AdapterBanner />

    <p>&copy; dagerikhl 2024 &ndash;</p>
  </header>
);
