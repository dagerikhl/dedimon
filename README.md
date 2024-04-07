# Dedimon

Dedicated server monitor

## Prerequisites

This project is made to run on a Windows machine.

- [Node.js v18+](https://nodejs.org).
- [Yarn v1](https://classic.yarnpkg.com).
- [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk/) (only the "Desktop C++ Apps" components need to be installed).
- (Possibly [node-gyp](https://github.com/nodejs/node-gyp), it may be installed already on some computers).
- Correctly setup environment variables in `.env.local` in the root of this project. See below for format.

```dotenv
NEXT_PUBLIC_ADAPTER="<one of the supported adapters, see below>"
APP_ID="<steam app id>"
SERVER_PATH="<path to your server directory>"
SERVER_EXE_PATH="<path to your server executable>"
SERVER_EXE_ARGS="<args to pass to server executable, comma seperated"
SERVER_CONFIG_PATHS="<path to your server config files, comma seperated>"
```

Examples:

```dotenv
NEXT_PUBLIC_ADAPTER="7-days-to-die"
APP_ID="251570"
SERVER_PATH="C:\Games\Steam\steamapps\common\7 Days to Die Dedicated Server"
SERVER_EXE_PATH="C:\Games\Steam\steamapps\common\7 Days to Die Dedicated Server\7DaysToDieServer.exe"
SERVER_EXE_ARGS="quit,batchmode,nographics,configfile=serverconfig.xml,dedicated"
SERVER_CONFIG_PATHS="C:\Games\Steam\steamapps\common\7 Days to Die Dedicated Server\serverconfig.xml"
```

```dotenv
NEXT_PUBLIC_ADAPTER="enshrouded"
APP_ID="2278520"
SERVER_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer"
SERVER_EXE_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer\enshrouded_server.exe"
SERVER_EXE_ARGS=""
SERVER_CONFIG_PATHS="C:\Games\Steam\steamapps\common\EnshroudedServer\enshrouded_server.json"
```

```dotenv
NEXT_PUBLIC_ADAPTER="v-rising"
APP_ID="1829350"
SERVER_PATH="C:\Games\Steam\steamapps\common\VRisingDedicatedServer"
SERVER_EXE_PATH="C:\Games\Steam\steamapps\common\VRisingDedicatedServer\VRisingServer.exe"
SERVER_EXE_ARGS=""
SERVER_CONFIG_PATHS="C:\Games\Steam\steamapps\common\VRisingDedicatedServer\ServerHostSettings.json,C:\Games\Steam\steamapps\common\VRisingDedicatedServer\ServerGameSettings.json"
```

### Adapters

Supported adapters/games (see `src/features/adapters/types/IAdapterType.ts` and `src/features/adapters/ADAPTERS.ts`):

- [7 Days to Die (`7-days-to-die`)](https://7daystodie.com/)
  - _Note: While the server will start, we're currently unable to proxy the logs from the server, thus rendering several parts of the application unusable._
- [Enshrouded (`enshrouded`)](https://enshrouded.com/)
- [V-rising (`v-rising`)](https://playvrising.com/)

## Getting Started

1. Install dependencies:
   ```bash
   yarn
   ```
2. Run development server:
   ```bash
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
