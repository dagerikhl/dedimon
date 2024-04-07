export interface IAdapterConfigSpecJson {
  type: "json";
  indent: string;
  newline: string;
  newlineEof: boolean;
}

export interface IAdapterConfigSpecXml {
  type: "xml";
  indent: string;
  newline: string;
  newlineEof: boolean;
}

export type IAdapterConfigSpec = IAdapterConfigSpecJson | IAdapterConfigSpecXml;
