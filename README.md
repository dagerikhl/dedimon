# Dedimon

Dedicated server monitor

## Prerequisites

This project is made to run on a Windows machine.

- [Node.js v18+](https://nodejs.org).
- [Yarn v1](https://classic.yarnpkg.com).
- [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk/) (only the "Desktop C++ Apps" components need to be installed).
- (Possibly [node-gyp](https://github.com/nodejs/node-gyp), it may be installed already on some computers).
- Correctly setup environment variables in `.env.local` in the root of this project. See below for format.

### Adapters

Supported adapters/games (see `src/features/adapters/types/IAdapterType.ts` and `src/features/adapters/ADAPTERS.ts`):

- [Aska (`aska`)](https://playaska.com/)
- [7 Days to Die (`7-days-to-die`)](https://7daystodie.com/)
  - _Note: We're currently unable to proxy the logs from the server terminal, so specifying a path to a log file in `SERVER_LOG_PATH` is required for the server to fully work._
  - _Note: There seems to be some issues with writing the logfile, so this might not work either. The server should still start, but you won't get much output, making major parts of the application unusable._
- [Enshrouded (`enshrouded`)](https://enshrouded.com/)
- [Soulmask (`soulmask`)](https://mask.qoolandgames.com/)
  - _Prerequisite: This server requires Steam to be installed on your system to run (specifically it requires som DLL files that is shipped with Steam)._
  - _Note: We're currently unable to proxy the logs from the server terminal, so specifying a path to a log file in `SERVER_LOG_PATH` is required for the server to fully work._
  - _Note: There are currently issues with the config file, so you may need to pass additional arguments to `SERVER_EXE_ARGS`: `-SteamServerName=<YOUR_SERVER_NAME>,-PSW=<your-password>,-Port=<your-port>,-QueryPort=<your-query-port>,-adminpsw=<your-admin-password>`._
- [V-rising (`v-rising`)](https://playvrising.com/)

### `.env.local` Config

#### Format

```dotenv
NEXT_PUBLIC_ADAPTER="<one of the supported adapters, see below>"
APP_ID="<steam app id>"
SERVER_PATH="<path to your server directory>"
SERVER_EXE_PATH="<path to your server executable>"
SERVER_EXE_ARGS="<args to pass to server executable, comma seperated"
SERVER_CONFIG_PATHS="<path to your server config files, comma seperated>"
SERVER_LOG_PATH="<path to a log file for your server, will be used if specified, and fall back to proxying exe terminal if not (may not work for all games)>"
```

#### Examples

##### Aska

```dotenv
NEXT_PUBLIC_ADAPTER="aska"
APP_ID="3246670"
SERVER_PATH="C:\Games\Servers\Aska_Server"
SERVER_EXE_PATH="C:\Games\Servers\Aska_Server\AskaServer.bat"
SERVER_EXE_ARGS=""
# You should edit the normal server properties.txt with your configuration, then make a backup copy because it may be overwritten by the server when updated
SERVER_CONFIG_PATHS="C:\Games\Servers\Aska_Server\server properties.txt,C:\Games\Servers\Aska_Server\server properties.backup.txt"
SERVER_LOG_PATH=""
```

##### 7 Days to Die

```dotenv
NEXT_PUBLIC_ADAPTER="7-days-to-die"
APP_ID="251570"
SERVER_PATH="C:\Games\Servers\7 Days to Die Dedicated Server"
SERVER_EXE_PATH="C:\Games\Servers\7 Days to Die Dedicated Server\7DaysToDieServer.exe"
SERVER_EXE_ARGS="-logfile 7DaysToDieServer_Data\log.txt,quit,batchmode,nographics,configfile=serverconfig.xml,dedicated"
SERVER_CONFIG_PATHS="C:\Games\Servers\7 Days to Die Dedicated Server\serverconfig.xml"
# This game's proxying of terminal log is broken, so it requires a log file specified here
SERVER_LOG_PATH="C:\Games\Servers\7 Days to Die Dedicated Server\log.txt"
```

##### Enshrouded

```dotenv
NEXT_PUBLIC_ADAPTER="enshrouded"
APP_ID="2278520"
SERVER_PATH="C:\Games\Servers\EnshroudedServer"
SERVER_EXE_PATH="C:\Games\Servers\EnshroudedServer\enshrouded_server.exe"
SERVER_EXE_ARGS=""
SERVER_CONFIG_PATHS="C:\Games\Servers\EnshroudedServer\enshrouded_server.json"
SERVER_LOG_PATH=""
```

##### Soulmask

```dotenv
NEXT_PUBLIC_ADAPTER="soulmask"
APP_ID="3017310"
SERVER_PATH="C:\Games\Servers\Soulmask_Server"
SERVER_EXE_PATH="C:\Games\Servers\Soulmask_Server\WSServer.exe"
SERVER_EXE_ARGS="Level01_Main,-server %*,-log,-UTF8Output,-MULTIHOME=0.0.0.0,-EchoPort=18888,-forcepassthrough"
SERVER_CONFIG_PATHS="C:\Games\Servers\Soulmask_Server\Engine.ini"
# This game's proxying of terminal log is broken, so it requires a log file specified here
SERVER_LOG_PATH="C:\Games\Servers\Soulmask_Server\WS\Saved\Logs\WS.log"
```

##### V-Rising

```dotenv
NEXT_PUBLIC_ADAPTER="v-rising"
APP_ID="1829350"
SERVER_PATH="C:\Games\Servers\VRisingDedicatedServer"
SERVER_EXE_PATH="C:\Games\Servers\VRisingDedicatedServer\VRisingServer.exe"
SERVER_EXE_ARGS=""
SERVER_CONFIG_PATHS="C:\Games\Servers\VRisingDedicatedServer\ServerHostSettings.json,C:\Games\Servers\VRisingDedicatedServer\ServerGameSettings.json"
SERVER_LOG_PATH=""
```

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
