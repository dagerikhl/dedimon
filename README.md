# Dedimon

Dedicated server monitor

## Prerequisites

This project is made to run on a Windows machine.

- [Node.js v18+](https://nodejs.org)
- [Yarn v1](https://classic.yarnpkg.com)
- [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk/) (only the "Desktop C++ Apps" components need to be installed)
- (Possibly [node-gyp](https://github.com/nodejs/node-gyp), it may be installed already on some computers)
- Correctly setup environment variables in `.env.local` in the root of this project. See below for format.

```dotenv
NEXT_PUBLIC_ADAPTER="<one of the supported adapters, see below>"
APP_ID="<steam app id>"
SERVER_PATH="<path to your server directory>"
SERVER_EXE_PATH="<path to your server executable>"
SERVER_CONFIG_PATHS="<path to your server config file>"
```

Examples:

```dotenv
NEXT_PUBLIC_ADAPTER="enshrouded"
APP_ID="2278520"
SERVER_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer"
SERVER_EXE_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer\enshrouded_server.exe"
SERVER_CONFIG_PATHS="C:\Games\Steam\steamapps\common\EnshroudedServer\enshrouded_server.json"
```

```dotenv
NEXT_PUBLIC_ADAPTER="v-rising"
APP_ID="1604030"
SERVER_PATH="C:\Games\Steam\steamapps\common\VRisingDedicatedServer"
SERVER_EXE_PATH="C:\Games\Steam\steamapps\common\VRisingDedicatedServer\VRisingServer.exe"
SERVER_CONFIG_PATHS="C:\Games\Steam\steamapps\common\VRisingDedicatedServer\ServerHostSettings.json,C:\Games\Steam\steamapps\common\VRisingDedicatedServer\ServerGameSettings.json"
```

### Adapters

Supported adapters/games (see `src/features/adapters/types/IAdapterType.ts`):

- `enshrouded`
- `v-rising`

## Getting Started

1. Install dependencies:
   ```bash
   yarn
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
