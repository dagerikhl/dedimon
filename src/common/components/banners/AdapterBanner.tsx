import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import cz from "classnames";
import Image from "next/image";
import styles from "./AdapterBanner.module.scss";

const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

export interface IAdapterBannerProps {
  className?: string;
}

export const AdapterBanner = ({ className }: IAdapterBannerProps) => {
  const label = ADAPTER.name ?? ADAPTER.id;

  return (
    <div className={cz(className, styles.container)}>
      {ADAPTER.logo && (
        <Image
          className={cz({ [styles.inverted]: ADAPTER.logo.inverted })}
          src={ADAPTER.logo.src}
          alt={`${label} logo`}
          height={ADAPTER.logo.height}
          width={ADAPTER.logo.width}
          title={label}
        />
      )}

      {ADAPTER.logo?.omitTextFromLogoBanner ? null : label}
    </div>
  );
};
