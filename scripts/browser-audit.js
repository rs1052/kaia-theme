import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const composeFile = resolve(root, "tests/browser-audit/compose.yml");
const auditScript = resolve(root, "tests/browser-audit/audit.js");
const port = process.env.KAIA_AUDIT_PORT ?? "8080";
const password = "kaia-audit-local-only";
const project = `kaia-audit-${createHash("sha256")
  .update(root)
  .digest("hex")
  .slice(0, 10)}`;
const healthUrl = `http://127.0.0.1:${port}/healthz`;

if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535)
  throw new Error(
    "KAIA_AUDIT_PORT must be a port number from 1 through 65535.",
  );

const composeEnvironment = {
  ...process.env,
  KAIA_AUDIT_PORT: port,
  KAIA_AUDIT_PASSWORD: password,
  KAIA_AUDIT_ROOT: root,
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: composeEnvironment,
    stdio: "inherit",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} exited with ${result.status}.`,
    );
  return result;
}

function capture(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: composeEnvironment,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  return result;
}

function requireDocker() {
  const result = spawnSync("docker", ["compose", "version"], {
    cwd: root,
    env: composeEnvironment,
    encoding: "utf8",
  });
  if (result.error?.code === "ENOENT")
    throw new Error(
      "Docker with the Compose plugin is required for the browser audit.",
    );
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `Docker Compose is unavailable: ${result.stderr.trim() || "unknown error"}`,
    );
}

function compose(args) {
  return run("docker", [
    "compose",
    "--project-name",
    project,
    "--file",
    composeFile,
    ...args,
  ]);
}

function composeCapture(args) {
  return capture("docker", [
    "compose",
    "--project-name",
    project,
    "--file",
    composeFile,
    ...args,
  ]);
}

async function health() {
  try {
    const response = await fetch(healthUrl, {
      signal: AbortSignal.timeout(3_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (await health()) return;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw new Error(
    `code-server did not become healthy within 60 seconds: ${healthUrl}`,
  );
}

async function start() {
  requireDocker();
  run("npm", ["run", "audit:themes"]);
  run("npm", ["run", "package:vsix"]);
  compose(["down", "--volumes", "--remove-orphans"]);
  try {
    compose(["up", "--detach", "--remove-orphans"]);
    await waitForHealth();
  } catch (error) {
    try {
      compose(["down", "--volumes", "--remove-orphans"]);
    } catch {
      // Keep the startup failure as the actionable error.
    }
    throw error;
  }
  console.log(`code-server is ready at ${healthUrl}`);
  console.log(`Password (local-only, not a secret): ${password}`);
}

async function status() {
  requireDocker();
  const running = composeCapture(["ps", "--status", "running", "--services"]);
  if (running.status !== 0 || !running.stdout.trim()) {
    console.log("code-server: stopped");
    process.exitCode = 1;
    return;
  }
  const healthy = await health();
  console.log(
    `code-server: running; health: ${healthy ? "ok" : "unreachable"} (${healthUrl})`,
  );
  if (!healthy) process.exitCode = 1;
}

function stop() {
  requireDocker();
  compose(["down", "--volumes", "--remove-orphans"]);
  console.log("code-server stopped and disposable audit state removed.");
}

async function audit() {
  let auditError;
  try {
    run("npx", ["playwright", "install", "chromium"]);
    await start();
    run("node", [auditScript]);
  } catch (error) {
    auditError = error;
  }
  let cleanupError;
  try {
    stop();
  } catch (error) {
    cleanupError = error;
  }
  if (auditError) {
    if (cleanupError)
      console.error(
        `Browser audit cleanup also failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`,
      );
    throw auditError;
  }
  if (cleanupError) throw cleanupError;
}

async function main() {
  const command = process.argv[2];
  if (!new Set(["audit", "start", "status", "stop"]).has(command))
    throw new Error(
      "Usage: node scripts/browser-audit.js <audit|start|status|stop>",
    );

  if (command === "audit") await audit();
  if (command === "start") await start();
  if (command === "status") await status();
  if (command === "stop") stop();
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
