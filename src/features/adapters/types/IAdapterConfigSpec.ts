export interface IAdapterConfigSpecJson {
  type: "json";
  indent: string;
  newlineEof: boolean;
}

export type IAdapterConfigSpec = IAdapterConfigSpecJson;
