// Unused, but kept as documentation
export interface I7DaysToDieServerConfigs {
  // GENERAL
  "Server Representation": {
    ServerName: boolean; // Whatever you want the name of the server to be. (DEFAULT = My Game Host)
    ServerDescription: string; // Whatever you want the server description to be, will be shown in the server browser. (DEFAULT = A 7 Days to Die server)
    ServerWebsiteURL: boolean; // URL for the server, will be shown in the serverbrowser as a clickable link (DEFAULT = Website)
    ServerPassword: boolean; // to gain entry to the server (DEFAULT = Password)
    ServerLoginConfirmationText: boolean; // set, the user will see the message during joining the server and has to confirm it before continuing. For more complex changes to this window you can change the 'serverjoinrulesdialog' window in XUi (DEFAULT = If)
    Region: boolean; // The region this server is in. Values: NorthAmericaEast, NorthAmericaWest, CentralAmerica, SouthAmerica, Europe, Russia, Asia, MiddleEast, Africa, Oceania (DEFAULT = NorthAmericaEast)
    Language: boolean; // Primary language for players on this server. Values: Use any language name that you would users expect to search for. Should be the English name of the language, e.g. not 'Deutsch' but 'German' (DEFAULT = English)
  };
  Networking: {
    ServerPort: number; // Port you want the server to listen on. Keep it in the ranges 26900 to 26905 or 27015 to 27020 if you want PCs on the same LAN to find it as a LAN server. (DEFAULT = 26900)
    ServerVisibility: number; // Visibility of this server: 2 = public, 1 = only shown to friends, 0 = not listed. As you are never friend of a dedicated server setting this to '1' will only work when the first player connects manually by IP. (DEFAULT = 2)
    ServerDisabledNetworkProtocols: boolean; // Networking protocols that should NOT be used. Separated by comma. Possible values: LiteNetLib, SteamNetworking. Dedicated servers should disable SteamNetworking if there is no NAT router in between your users and the server or when port-forwarding is set up correctly. LiteNetLib should only be disabled for temporary troubleshooting. (DEFAULT = SteamNetworking)
    ServerMaxWorldTransferSpeedKiBs: number; // Maximum (!) speed in kiB/s the world is transferred at to a client on first connect if it does not have the world yet. Maximum is about 1300 kiB/s, even if you set a higher value (DEFAULT = 512)
  };
  Slots: {
    ServerMaxPlayerCount: number; // Maximum Concurrent Players (DEFAULT = 8)
    ServerReservedSlots: number; // Out of the MaxPlayerCount this many slots can only be used by players with a specific permission level (DEFAULT = 0)
    ServerReservedSlotsPermission: number; // Required permission level to use reserved slots above (DEFAULT = 100)
    ServerAdminSlots: number; // This many admins can still join even if the server has reached MaxPlayerCount (DEFAULT = 0)
    ServerAdminSlotsPermission: number; // Required permission level to use the admin slots above (DEFAULT = 0)
  };
  "Admin interfaces": {
    WebDashboardEnabled: boolean; // Enable/disable the web dashboard (DEFAULT = false)
    WebDashboardPort: number; // Port of the web dashboard (DEFAULT = 8080)
    WebDashboardUrl: boolean; // URL to the web dashboard if not just using the public IP of the server, e.g. if the web dashboard is behind a reverse proxy. Needs to be the full URL, like 'https://domainOfReverseProxy.tld:1234/'. Can be left empty if directly using the public IP and dashboard port (DEFAULT = External)
    EnableMapRendering: boolean; // Enable/disable rendering of the map to tile images while exploring it. This is used e.g. by the web dashboard to display a view of the map. (DEFAULT = false)
    TelnetEnabled: boolean; // Enable/Disable the telnet (DEFAULT = true)
    TelnetPort: number; // Port of the telnet server (DEFAULT = 8081)
    TelnetPassword: boolean; // to gain entry to telnet interface. If no password is set the server will only listen on the local loopback interface (DEFAULT = Password)
    TelnetFailedLoginLimit: number; // After this many wrong passwords from a single remote client the client will be blocked from connecting to the Telnet interface (DEFAULT = 10)
    TelnetFailedLoginsBlocktime: number; // How long will the block persist (in seconds) (DEFAULT = 10)
    TerminalWindowEnabled: boolean; // Show a terminal window for log output / command input (Windows only) (DEFAULT = true)
  };
  "Folder and file locations": {
    AdminFileName: boolean; // Server admin file name. Path relative to the SaveGameFolder (DEFAULT = serveradmin.xml)
    UserDataFolder: boolean; // Use this to override where the server stores all generated data, including RWG generated worlds. Do not forget to uncomment the entry! (DEFAULT = absolute path)
    SaveGameFolder: boolean; // Use this to only override the save game path. Do not forget to uncomment the entry! (DEFAULT = absolute path)
  };
  "Other technical settings": {
    EACEnabled: boolean; // Enables/Disables EasyAntiCheat (DEFAULT = true)
    HideCommandExecutionLog: number; // Hide logging of command execution. 0 = show everything, 1 = hide only from Telnet/ControlPanel, 2 = also hide from remote game clients, 3 = hide everything (DEFAULT = 0)
    MaxUncoveredMapChunksPerPlayer: number; // Override how many chunks can be uncovered on the ingame map by each player. Resulting max map file size limit per player is (x * 512 Bytes), uncovered area is (x * 256 m²). Default 131072 means max 32 km² can be uncovered at any time (DEFAULT = 131072)
    PersistentPlayerProfiles: boolean; // If disabled a player can join with any selected profile. If true they will join with the last profile they joined with (DEFAULT = false)
  };

  // GAMEPLAY
  World: {
    GameWorld: boolean; // 'RWG' (see WorldGenSeed and WorldGenSize options below) or any already existing world name in the Worlds folder (currently shipping with e.g. 'Navezgane', 'PREGEN01', ...) (DEFAULT = Navezgane)
    WorldGenSeed: boolean; // If RWG this is the seed for the generation of the new world. If a world with the resulting name already exists it will simply load it (DEFAULT = asdf)
    WorldGenSize: number; // If RWG this controls the width and height of the created world. It is also used in combination with WorldGenSeed to create the internal RWG seed thus also creating a unique map name even if using the same WorldGenSeed. Has to be between 2048 and 16384, though large map sizes will take long to generate / download / load (DEFAULT = 4096)
    GameName: boolean; // Whatever you want the game name to be. This affects the save game name as well as the seed used when placing decoration (trees etc) in the world. It does not control the generic layout of the world if creating an RWG world (DEFAULT = My Game)
    GameMode: boolean; // GameModeSurvival (DEFAULT = GameModeSurvival)
  };
  Difficulty: {
    GameDifficulty: number; // 0 - 5, 0=easiest, 5=hardest (DEFAULT = 2)
    BlockDamagePlayer: number; // How much damage do players to blocks (percentage in whole numbers) (DEFAULT = 100)
    BlockDamageAI: number; // How much damage do AIs to blocks (percentage in whole numbers) (DEFAULT = 100)
    BlockDamageAIBM: number; // How much damage do AIs during blood moons to blocks (percentage in whole numbers) (DEFAULT = 100)
    XPMultiplier: number; // XP gain multiplier (percentage in whole numbers) (DEFAULT = 100)
    PlayerSafeZoneLevel: number; // If a player is less than or equal to this level he will create a safe zone (no enemies) when spawned (DEFAULT = 5)
    PlayerSafeZoneHours: number; // Hours in world time this safe zone exists (DEFAULT = 5)
  };
  Unnamed: {
    BuildCreate: boolean; // cheat mode on/off (DEFAULT = false)
    DayNightLength: number; // real time minutes per in game day: 60 minutes (DEFAULT = 60)
    DayLightLength: number; // in game hours the sun shines per day: 18 hours daylight per in game day (DEFAULT = 18)
    DeathPenalty: number; // Penalty after dying. 0 = Nothing. 1 = Default: Classic XP Penalty. 2 = Injured: You keep most of your debuffs. Food and Water is set to 50% on respawn. 3 = Permanent Death: Your character is completely reset. You will respawn with a fresh start within the saved game. (DEFAULT = 1)
    DropOnDeath: number; // 0 = nothing, 1 = everything, 2 = toolbelt only, 3 = backpack only, 4 = delete all (DEFAULT = 1)
    DropOnQuit: number; // 0 = nothing, 1 = everything, 2 = toolbelt only, 3 = backpack only (DEFAULT = 0)
    BedrollDeadZoneSize: number; // Size (box 'radius', so a box with 2 times the given value for each side's length) of bedroll deadzone, no zombies will spawn inside this area, and any cleared sleeper volumes that touch a bedroll deadzone will not spawn after they've been cleared. (DEFAULT = 15)
    BedrollExpiryTime: number; // Number of days a bedroll stays active after owner was last online (DEFAULT = 45)
  };
  "Performance related": {
    MaxSpawnedZombies: number; // This setting covers the entire map. There can only be this many zombies on the entire map at one time. Changing this setting has a huge impact on performance. (DEFAULT = 64)
    MaxSpawnedAnimals: number; // If your server has a large number of players you can increase this limit to add more wildlife. Animals don't consume as much CPU as zombies. NOTE: That this doesn't cause more animals to spawn arbitrarily: The biome spawning system only spawns a certain number of animals in a given area, but if you have lots of players that are all spread out then you may be hitting the limit and can increase it. (DEFAULT = 50)
    ServerMaxAllowedViewDistance: number; // Max viewdistance a client may request (6 - 12). High impact on memory usage and performance. (DEFAULT = 12)
    MaxQueuedMeshLayers: number; // Maximum amount of Chunk mesh layers that can be enqueued during mesh generation. Reducing this will improve memory usage but may increase Chunk generation time (DEFAULT = 1000)
  };
  "Zombie settings": {
    EnemySpawnMode: boolean; // Enable/Disable enemy spawning (DEFAULT = true)
    EnemyDifficulty: number; // 0 = Normal, 1 = Feral (DEFAULT = 0)
    ZombieMove: number; // 0-4 (walk, jog, run, sprint, nightmare) (DEFAULT = 0)
    ZombieMoveNight: number; // 0-4 (walk, jog, run, sprint, nightmare) (DEFAULT = 3)
    ZombieFeralMove: number; // 0-4 (walk, jog, run, sprint, nightmare) (DEFAULT = 3)
    ZombieBMMove: number; // 0-4 (walk, jog, run, sprint, nightmare) (DEFAULT = 3)
    BloodMoonFrequency: number; // What frequency (in days) should a blood moon take place. Set to '0' for no blood moons (DEFAULT = 7)
    BloodMoonRange: number; // How many days can the actual blood moon day randomly deviate from the above setting. Setting this to 0 makes blood moons happen exactly each Nth day as specified in BloodMoonFrequency (DEFAULT = 0)
    BloodMoonWarning: number; // The Hour number that the red day number begins on a blood moon day. Setting this to -1 makes the red never show. (DEFAULT = 8)
    BloodMoonEnemyCount: number; // This is the number of zombies that can be alive (spawned at the same time) at any time PER PLAYER during a blood moon horde, however, MaxSpawnedZombies overrides this number in multiplayer games. Also note that your game stage sets the max number of zombies PER PARTY. Low game stage values can result in lower number of zombies than the BloodMoonEnemyCount setting. Changing this setting has a huge impact on performance. --> (DEFAULT = 8)
  };
  Loot: {
    LootAbundance: number; // percentage in whole numbers Note that this only affects stack sizes, not % to get loot. (DEFAULT = 100)
    LootRespawnDays: number; // days in whole numbers (DEFAULT = 30)
    AirDropFrequency: number; // How often airdrop occur in game-hours, 0=never (DEFAULT = 72)
    AirDropMarker: boolean; // Sets if a marker is added to map/compass for air drops (DEFAULT = False)
  };
  Multiplayer: {
    PartySharedKillRange: number; // The distance you must be within to receive party shared kill xp and quest party kill objective credit. (DEFAULT = 100)
    PartyKillingMode: number; // Player Killing Settings (0 = No Killing, 1 = Kill Allies Only, 2 = Kill Strangers Only, 3 = Kill Everyone) (DEFAULT = 3)
  };
  "Land claim options": {
    LandClaimCount: number; // Maximum allowed land claims per player (DEFAULT = 1)
    LandClaimSize: number; // Size in blocks that is protected by a land claim block (DEFAULT = 41)
    LandClaimDeadZone: number; // Land claim blocks must be this many blocks apart (unless you are friends with the other player) (DEFAULT = 30)
    LandClaimExpiryTime: number; // The number of days a player can be offline before their claims expire and are no longer protected (DEFAULT = 7)
    LandClaimDecayMode: number; // Controls how offline players land claims decay. 0=Slow (Linear) , 1=Fast (Exponential), 2=None (Full protection until claim is expired). (DEFAULT = 0)
    LandClaimOnlineDurabilityModifier: number; // How much protected claim area block hardness is increased when a player is online. 0 means infinite (no damage will ever be taken). Default is 4x (DEFAULT = 4)
    LandClaimOfflineDurabilityModifier: number; // How much protected claim area block hardness is increased when a player is offline. 0 means infinite (no damage will ever be taken). Default is 4x (DEFAULT = 4)
    LandClaimOfflineDelay: number; // The number of minutes after a player logs out that the land claim area hardness transitions from online to offline. Default is 0 (DEFAULT = 0)
  };
  General: {
    DynamicMeshEnabled: boolean; // Is Dynamic Mesh system enabled (DEFAULT = true)
    DynamicMeshLandClaimOnly: boolean; // Is Dynamic Mesh system only active in player LCB areas (DEFAULT = true)
    DynamicMeshLandClaimBuffer: number; // Dynamic Mesh LCB chunk radius (DEFAULT = 3)
    DynamicMeshMaxItemCache: number; // How many items can be processed concurrently, higher values use more RAM (DEFAULT = 3)
    TwitchServerPermission: number; // Required permission level to use twitch integration on the server (DEFAULT = 90)
    TwitchBloodMoonAllowed: boolean; // If the server allows twitch actions during a blood moon. This could cause server lag with extra zombies being spawned during blood moon. (DEFAULT = false)
    MaxChunkAge: boolean; // The number of in-game days which must pass since visiting a chunk before it will reset to its original state if not revisited or protected (e.g. by a land claim or bedroll being in close proximity). (DEFAULT = undefined)
    SaveDataLimit: boolean; // The maximum disk space allowance for each saved game in megabytes (MB). Saved chunks may be forceably reset to their original states to free up space when this limit is reached. Negative values disable the limit. (DEFAULT = undefined)
  };
}
