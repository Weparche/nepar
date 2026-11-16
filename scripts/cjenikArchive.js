import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const RETENTION_DAYS = 15;

export function listArchiveSnapshots(archiveDir) {
  let files;
  try {
    files = readdirSync(archiveDir).filter((name) => name.endsWith(".json"));
  } catch {
    return [];
  }
  return files.map((name) => JSON.parse(readFileSync(resolve(archiveDir, name), "utf8")));
}

/** Snapshotovi čiji je `supersededAt` unutar `retentionDays` od `now` — Nove objave zadržavaju se 15 dana; starijim objavama ostaje prethodni rok. */
export function retainedSnapshots(archiveDir, now = Date.now(), retentionDays = RETENTION_DAYS) {
  return listArchiveSnapshots(archiveDir).filter(
    (snapshot) => now - new Date(snapshot.meta.supersededAt).getTime() <= (snapshot.meta.retentionDays ?? (snapshot.meta.formatVersion >= 3 ? retentionDays : 30)) * 24 * 60 * 60 * 1000,
  );
}
