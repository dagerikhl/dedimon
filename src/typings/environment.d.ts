import { IAdapterType } from "@/features/adapters/types/IAdapterType";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ADAPTER: IAdapterType;
      APP_ID?: string;
      SERVER_PATH?: string;
      SERVER_EXE_PATH?: string;
      SERVER_CONFIG_PATH?: string;
    }
  }
}
