# Dedimon

Dedicated server monitor

## Prerequisites

- [Node.js v18+](https://nodejs.org)
- [Yarn v1](https://classic.yarnpkg.com)
- Correctly setup environment variables in `.env.local` in the root of this project. See below for format.

```dotenv
STEAMCMD_PATH="<path to your steamcmd executable>"
SERVER_PATH="<path to your server directory>"
SERVER_EXE_PATH="<path to your server executable>"
SERVER_CONFIG_PATH="<path to your server config file>"
```

Example:

```dotenv
STEAMCMD_PATH="C:\Games\Steam\steamcmd.exe"
SERVER_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer"
SERVER_EXE_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer\enshrouded_server.exe"
SERVER_CONFIG_PATH="C:\Games\Steam\steamapps\common\EnshroudedServer\enshrouded_server.json"
```

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
