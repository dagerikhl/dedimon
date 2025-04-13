// Unused, but kept as documentation
export interface IRtmServerConfigs {
  "dedimon-properties.txt": {
    /**
     * Save id is what comes after "savegame_" on a save file and can be
     * provided to make the server load that save, the save file will be
     * searched in the "server" folder next to the normal game save folders,
     * in this case the session display name, seed and other new session
     * customization will be ignored, moreover, when creating a new save the
     * save id will be filled in by the server once the session opens so to be able to
     * seemlesly load this save again after the first time.
     */
    "save id"?: string;

    /** Display name is the name the session displays in the session list for new saves, for old saves it will take the name from the save itself. */
    "display name"?: string;
    /** Override for the host name that is displayed in the session list, if left blank it will use what would normally be used when hosting from this machine. */
    "server name"?: string;
    /** The seed of the new save. */
    seed?: string;
    /** The password this session will have. */
    password?: string;
    /** The region to open this session on, leave default to ping the best region. */
    region?:
      | "default"
      | "asia"
      | "japan"
      | "europe"
      | "south america"
      | "south korea"
      | "usa east"
      | "usa west"
      | "australia"
      | "canada east"
      | "hong kong"
      | "india"
      | "turkey"
      | "united arab emirates"
      | "usa south central";
    /** If set to true when the session is open, the world is also updating, even without players, if set to false, the world loads when the first player joins and the world unloads when the last player leaves. */
    "keep server world alive"?: boolean;

    /** Set to normal for the standard way of playing or to custom to be able to customize certain aspects of gameplay. */
    mode?: "normal" | string;
    /** Only works in custom mode. */
    "terrain aspect"?: "smooth" | "normal" | "rocky";
    /** Only works in custom mode. */
    "terrain height"?: "flat" | "normal" | "varied";
    /** Only works in custom mode. */
    "starting season"?: "spring" | "summer" | "autumn" | "winter";
    /** Only works in custom mode. */
    "year length"?: "minimum" | "reduced" | "deafult" | "extended" | "maximum";
    /** Only works in custom mode. */
    precipitation?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** Only works in custom mode. */
    "day length"?: "minimum" | "reduced" | "default" | "extended" | "maximum";
    /** Only works in custom mode. */
    "structure decay"?: "low" | "medium" | "high";
    /** Only works in custom mode. */
    "invasion dificulty"?: "off" | "easy" | "normal" | "hard";
    /** Only works in custom mode. */
    "monster density"?: "off" | "low" | "medium" | "high";
    /** Only works in custom mode. */
    "monster population"?: "low" | "medium" | "high";
    /** Only works in custom mode. */
    "wulfar population"?: "low" | "medium" | "high";
    /** Only works in custom mode. */
    "herbivore population"?: "low" | "medium" | "high";
    /** Only works in custom mode. */
    "bear population"?: "low" | "medium" | "high";
  };
}
