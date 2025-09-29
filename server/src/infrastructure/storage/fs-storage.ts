import fs from "fs";
import { glob } from "glob";
import path from "path";
import { StoragePort } from "../../domain/ports/storage-port";

export class FSStorage implements StoragePort {
  baseName(p: string): string {
    return path.basename(p);
  }
  join(...parts: string[]): string {
    return path.join(...parts);
  }

  async ensureDir(p: string) {
    await fs.promises.mkdir(p, { recursive: true });
  }
  async remove(p: string) {
    await fs.promises.rm(p, { recursive: true, force: true });
  }
  async removeIfExists(p: string) {
    if (await this.fileExists(p)) await this.remove(p);
  }

  async list(patternGlob: string): Promise<string[]> {
    return glob(patternGlob, { windowsPathsNoEscape: true });
  }

  async fileExists(p: string): Promise<boolean> {
    try {
      await fs.promises.access(p, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async fileStat(p: string) {
    return fs.promises.stat(p);
  }

  async writeStreamToFile(
    stream: NodeJS.ReadableStream,
    outPath: string
  ): Promise<void> {
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    const ws = fs.createWriteStream(outPath);
    const done = new Promise<void>((res, rej) => {
      ws.on("finish", () => res());
      ws.on("error", rej);
    });
    stream.pipe(ws);
    await done;
  }

  async saveBuffer(buffer: Buffer, outPath: string): Promise<void> {
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await fs.promises.writeFile(outPath, buffer);
  }
}
