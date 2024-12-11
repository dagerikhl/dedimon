export interface IAdapterConfigSpecIni {
  type: "ini";
  indent: string;
  newline: string;
  newlineEof: boolean;
}

export interface IAdapterConfigSpecJson {
  type: "json";
  indent: string;
  newline: string;
  newlineEof: boolean;
}

export interface IAdapterConfigSpecText {
  type: "text";
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

export type IAdapterConfigSpec =
  | IAdapterConfigSpecIni
  | IAdapterConfigSpecJson
  | IAdapterConfigSpecText
  | IAdapterConfigSpecXml;
