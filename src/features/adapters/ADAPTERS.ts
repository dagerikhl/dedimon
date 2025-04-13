import { ASKA_ADAPTER_SPEC } from "@/features/adapters/aska/spec";
import { SEVEN_DAYS_TO_DIE_ADAPTER_SPEC } from "@/features/adapters/7-days-to-die/spec";
import { ENSHROUDED_ADAPTER_SPEC } from "@/features/adapters/enshrouded/spec";
import { SOULMASK_ADAPTER_SPEC } from "@/features/adapters/soulmask/spec";
import { V_RISING_ADAPTER_SPEC } from "@/features/adapters/v-rising/spec";
import { RTM_ADAPTER_SPEC } from "./rtm/spec";

export const ADAPTERS = {
  aska: ASKA_ADAPTER_SPEC,
  "7-days-to-die": SEVEN_DAYS_TO_DIE_ADAPTER_SPEC,
  enshrouded: ENSHROUDED_ADAPTER_SPEC,
  rtm: RTM_ADAPTER_SPEC,
  soulmask: SOULMASK_ADAPTER_SPEC,
  "v-rising": V_RISING_ADAPTER_SPEC,
};
