import archiver from "archiver";
import fs from "fs";
import path from "path"; // ✅ use import ESM
import { ZipPort } from "../../domain/ports/zip-port"; // ✅ repare o .js no fim

export class ArchiverZipService implements ZipPort {
  async createZipFromFiles(
    files: string[],
    zipOutputPath: string
  ): Promise<void> {
    await fs.promises.mkdir(path.dirname(zipOutputPath), { recursive: true }); // ✅ sem require
    const output = fs.createWriteStream(zipOutputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    const done = new Promise<void>((resolve, reject) => {
      output.on("close", () => resolve());
      archive.on("error", (err) => reject(err));
    });

    archive.pipe(output);
    for (const f of files) {
      archive.file(f, { name: path.basename(f) }); // ✅ sem require
    }
    await archive.finalize();
    await done;
  }
}
