/**
 * Pin the Next standalone production server (`.next/standalone/server.js`)
 * to a deploy-safe port.
 *
 * Why: the deploy runtime (.zscripts/start.sh on the FC side) does
 * `export PORT="${PORT:-3000}" && bun server.js` and aborts the whole deploy
 * if the server dies within 1s. If the runtime environment's own agent
 * already holds :3000, the app dies with EADDRINUSE, Caddy :81 fronts a dead
 * upstream, the 120s health check times out and the deploy reports
 * "Sorry, there was a problem deploying the code" — with everything green
 * locally. Moving the app off :3000 removes that collision.
 *
 * Pairing contract (must stay in sync):
 *   - default 4000            -> FC runtime; repo Caddyfile upstream is
 *                                reverse_proxy localhost:4000
 *   - FORCE_PORT=3000         -> scripts/publish.sh, because the SANDBOX
 *                                front proxy (:81, platform-owned config)
 *                                is hardwired to localhost:3000
 * start.sh's exported PORT is deliberately ignored (cosmetic there).
 */
const fs = require('fs');

const PORT = 4000;
const FILE = '.next/standalone/server.js';

let src;
try {
  src = fs.readFileSync(FILE, 'utf8');
} catch (err) {
  console.error(`force-server-port: cannot read ${FILE}: ${err.message}`);
  process.exit(1);
}

const pattern = /const currentPort = parseInt\(process\.env\.PORT, 10\) \|\| \d+/;
const replacement = `const currentPort = parseInt(process.env.FORCE_PORT, 10) || ${PORT}`;

if (!pattern.test(src)) {
  // Warn and succeed: the deploy must never fail because of this cosmetic
  // pin. If Next.js changed server.js's port resolution, the app simply
  // keeps its upstream default (3000) and the Caddyfile pair needs a
  // matching manual update.
  console.warn(
    'force-server-port: WARNING - port resolution line not found in server.js ' +
      '(Next.js layout changed?); skipping the pin, keeping upstream default',
  );
  process.exit(0);
}

fs.writeFileSync(FILE, src.replace(pattern, replacement));
console.log(`force-server-port: standalone server pinned to FORCE_PORT || ${PORT}`);
