// Unused, but kept as documentation
export interface IEnshroudedServerConfigs {
  "enshrouded_server.json": {
    name: string;
    password: string;
    saveDirectory: string;
    logDirectory: string;
    ip: string;
    gamePort: number;
    queryPort: number;
    slotCount: 4 | 8 | 16 | 32;
  };
}
