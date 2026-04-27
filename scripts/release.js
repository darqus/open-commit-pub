import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const PUB_DIR = path.resolve(ROOT_DIR, "../open-commit-pub");

function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: options.cwd || ROOT_DIR,
      encoding: "utf8",
      stdio: options.silent ? "pipe" : "inherit",
    }).trim();
  } catch {
    return "";
  }
}

function main() {
  console.log("=== Релиз ===\n");

  const versionType = process.argv[2] || "patch";

  console.log("1. Копирование в pub...");
  exec("node scripts/copy-to-pub.js");

  console.log("\n2. Релиз в pub...");
  exec(`./scripts/release.sh ${versionType}`, { cwd: PUB_DIR });

  console.log("\n3. Push...");
  exec("git push", { cwd: PUB_DIR });
  exec("git push --tags", { cwd: PUB_DIR });

  console.log("\n✓ Релиз завершён!");
}

main();