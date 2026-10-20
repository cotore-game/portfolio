import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "node_modules/next/dist/bin/next");
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  process.exitCode = code;
}
for (const [directory, port] of [
  [root, "3000"],
  [path.join(root, "studio"), "3002"],
]) {
  const child = spawn(
    process.execPath,
    [cli, "dev", "--hostname", "127.0.0.1", "--port", port],
    { cwd: directory, stdio: "inherit", env: process.env },
  );
  children.push(child);
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code ?? 1);
  });
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
