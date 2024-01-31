// TODO Adapterify (need to adapterify a lot of stuff to do this (needs to be a global config, and parse values based on that)
export interface IApiServerStateInfo {
  gameVersion?: string;
  baseCount?: number;
  entityCount?: number;
  publicIp?: string;
  lastSaved?: string;
}
