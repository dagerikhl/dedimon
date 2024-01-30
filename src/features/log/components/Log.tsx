"use client";

import { LogView } from "@/features/log/components/LogView";
import { useEffect, useState } from "react";

// TODO Remove
let i = 0;
// TODO Remove
const MESSAGES = [
  "MaxClientComponents: 4",
  "Snapshot took 3.14 ms:  Entities: 2,099 (872,576 bytes)  Storages: 94 (306,816 bytes)  Chunks: 128 (1,835,863 / 8,388,608 bytes)  ClientComps: 10,700 bytes  Templates: 2,880  TotalSize: ~9,600,140",
  "VoxelSaveSize: 393,672",
  "[ecss] writeEntitySerializationContext:",
  "[ecss]   Templates: 82 (9,496 bytes) Components: 147 (51,704 bytes)  Size: 61,200",
  "[ecss]   Entities: 1,085 (77 children)",
  "[savexxx] SAVE 3 bases 1,007 entities size 776,095",
  "[server] Save Serialization took 183.80 ms over 12 Ticks",
  "[server] Saved",
  "[savedata] Compression of Blob 0x00000000::KNOW took 341.00 us",
  "[savedata] Compression of Blob 0x00000539::SRSG took 15.25 ms",
  "[server] Start Saving",
  "[savedata] Compression of Blob 0x00000000::USER took 361.00 us",
  "MaxClientComponents: 4",
  "Snapshot took 6.63 ms:  Entities: 2,099 (872,576 bytes)  Storages: 94 (306,816 bytes)  Chunks: 128 (1,835,863 / 8,388,608 bytes)  ClientComps: 10,700 bytes  Templates: 2,880  TotalSize: ~9,600,140",
  "VoxelSaveSize: 393,672",
  "[ecss] writeEntitySerializationContext:",
  "[ecss]   Templates: 82 (9,496 bytes) Components: 147 (51,704 bytes)  Size: 61,200",
  "[ecss]   Entities: 1,085 (77 children)",
  "[savexxx] SAVE 3 bases 1,007 entities size 776,095",
  "[server] Save Serialization took 182.35 ms over 12 Ticks",
  "[server] Saved",
  "[savedata] Compression of Blob 0x00000000::KNOW took 258.00 us",
  "[savedata] Compression of Blob 0x00000539::SRSG took 9.36 ms",
  "[server] Start Saving",
  "[savedata] Compression of Blob 0x00000000::USER took 230.00 us",
  "MaxClientComponents: 4",
  "Snapshot took 1.98 ms:  Entities: 2,099 (872,576 bytes)  Storages: 94 (306,816 bytes)  Chunks: 128 (1,835,863 / 8,388,608 bytes)  ClientComps: 10,700 bytes  Templates: 2,880  TotalSize: ~9,600,140",
  "VoxelSaveSize: 393,672",
  "[ecss] writeEntitySerializationContext:",
  "[ecss]   Templates: 82 (9,496 bytes) Components: 147 (51,704 bytes)  Size: 61,200",
  "[ecss]   Entities: 1,085 (77 children)",
  "[savexxx] SAVE 3 bases 1,007 entities size 776,095",
  "[server] Save Serialization took 253.54 ms over 15 Ticks",
  "[server] Saved",
  "[savedata] Compression of Blob 0x00000000::KNOW took 285.00 us",
  "[savedata] Compression of Blob 0x00000539::SRSG took 17.65 ms",
  "[server] Start Saving",
  "[savedata] Compression of Blob 0x00000000::USER took 414.00 us",
  "MaxClientComponents: 4",
  "Snapshot took 2.92 ms:  Entities: 2,099 (872,576 bytes)  Storages: 94 (306,816 bytes)  Chunks: 128 (1,835,863 / 8,388,608 bytes)  ClientComps: 10,700 bytes  Templates: 2,880  TotalSize: ~9,600,140",
  "VoxelSaveSize: 393,672",
  "[savedata] Compression of Blob 0x00000000::KNOW took 337.00 us",
  "[ecss] writeEntitySerializationContext:",
  "[ecss]   Templates: 82 (9,496 bytes) Components: 147 (51,704 bytes)  Size: 61,200",
  "[ecss]   Entities: 1,085 (77 children)",
  "[savexxx] SAVE 3 bases 1,007 entities size 776,095",
  "[server] Save Serialization took 215.17 ms over 14 Ticks",
  "[server] Saved",
  "[savedata] Compression of Blob 0x00000539::SRSG took 5.72 ms",
];

export const Log = () => {
  // TODO Get from API
  const [log, setLog] = useState<string[]>([]);

  // TODO Remove
  useEffect(() => {
    const id = setInterval(() => {
      setLog((current) => [...current, MESSAGES[i]]);

      i = (i + 1) % MESSAGES.length;
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return <LogView log={log} />;
};
