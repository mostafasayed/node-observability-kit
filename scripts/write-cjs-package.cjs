import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const targetPath = join("dist", "cjs", "package.json");
await mkdir(dirname(targetPath), { recursive: true });
await writeFile(
  targetPath,
  JSON.stringify({ type: "commonjs" }, null, 2) + "\n",
  "utf8",
);
