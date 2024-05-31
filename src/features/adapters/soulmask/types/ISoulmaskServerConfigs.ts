// Unused, but kept as documentation
export interface ISoulmaskServerConfigs {
  "Engine.ini": {
    URL: {
      Port: number;
    };
    OnlineSubsystemSteam: {
      GameServerQueryPort: number;
    };
    "Dedicated.Settings": {
      SteamServerName: string;
      MaxPlayers: number;
      pvp: "False" | "True";
      backup: number;
      saving: number;
    };
  };
}
