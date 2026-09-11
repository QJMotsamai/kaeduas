// Ship the site: build dist/ and push it to the `deploy` branch, which is what
// GitHub Pages serves. The deploy branch holds ONLY compiled output — no source,
// no build step on the server — so every push there is a live deploy.
//
//   npm run deploy                      # build + push
//   npm run deploy -- --message "..."   # custom commit message
//   npm run deploy -- --no-build        # push whatever is already in dist/
//   npm run deploy -- --dry-run         # build + stage, show what would ship, push nothing
//
// It never touches your working tree: dist/ is built in place, then the deploy
// branch is cloned into a temp dir, overwritten with dist/, committed and pushed.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const branch = process.env.DEPLOY_BRANCH || 'deploy';
const noBuild = args.includes('--no-build');
const dryRun = args.includes('--dry-run');
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const message = flag('--message', `Deploy: ${new Date().toISOString().slice(0, 10)} build`);

const run = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { stdio: 'inherit', ...opts });
const capture = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString().trim();
// `git config` exits 1 when a value is unset, which is not an error for us.
const tryCapture = (cmd, cmdArgs, opts = {}) => {
  try {
    return capture(cmd, cmdArgs, opts);
  } catch {
    return '';
  }
};
// Prefer the repo's own identity so deploys are attributed to the person pushing.
const globalIdentity = (key) => tryCapture('git', ['config', '--global', key]) || tryCapture('git', ['config', key]);

const repoRoot = resolve(import.meta.dirname, '..');
const dist = join(repoRoot, 'dist');

// 1. Build ------------------------------------------------------------------
if (noBuild) {
  console.log('· skipping build (--no-build)');
} else {
  console.log('· building…');
  run('npm', ['run', 'build'], { cwd: repoRoot });
}
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`✗ no dist/index.html — build failed or missing. Nothing pushed.`);
  process.exit(1);
}

// Sanity check: the build must actually carry the structured data.
const built = (await import('node:fs')).readFileSync(join(dist, 'index.html'), 'utf8');
if (!built.includes('application/ld+json')) {
  console.error('✗ dist/index.html has no JSON-LD block — refusing to push.');
  process.exit(1);
}

// 2. Clone the deploy branch into a temp dir --------------------------------
const remote = capture('git', ['remote', 'get-url', 'origin'], { cwd: repoRoot });
const tmp = mkdtempSync(join(tmpdir(), 'kaeduas-deploy-'));
let pushed = false;

try {
  console.log(`· cloning ${branch} from origin…`);
  try {
    run('git', ['clone', '--depth', '1', '--branch', branch, remote, tmp]);
  } catch {
    console.log(`· no ${branch} branch yet — creating it from scratch`);
    run('git', ['clone', '--depth', '1', remote, tmp]);
    run('git', ['-C', tmp, 'switch', '--orphan', branch]);
    run('git', ['-C', tmp, 'rm', '-rf', '--cached', '.'], { stdio: 'ignore' });
  }

  // 3. Replace everything in the branch with the fresh build (keep .git) ------
  for (const entry of readdirSync(tmp)) {
    if (entry !== '.git') rmSync(join(tmp, entry), { recursive: true, force: true });
  }
  cpSync(dist, tmp, { recursive: true });

  run('git', ['-C', tmp, 'add', '-A']);
  const staged = capture('git', ['-C', tmp, 'status', '--porcelain']);
  if (!staged) {
    console.log('· nothing changed — deploy branch is already up to date');
    pushed = true; // nothing to do, not a failure
  } else {
    console.log(`· changes:\n${staged.split('\n').map((l) => `    ${l}`).join('\n')}`);
    if (!tryCapture('git', ['-C', tmp, 'config', 'user.name'])) {
      run('git', ['-C', tmp, 'config', 'user.name', globalIdentity('user.name') || 'kaeduas-deploy']);
    }
    if (!tryCapture('git', ['-C', tmp, 'config', 'user.email'])) {
      run('git', ['-C', tmp, 'config', 'user.email', globalIdentity('user.email') || 'deploy@kaeduas.local']);
    }
    run('git', ['-C', tmp, 'commit', '-m', message, '--no-verify'], { stdio: 'ignore' });

    if (dryRun) {
      console.log(`\n✓ dry run — committed locally in ${tmp}, not pushed.`);
      console.log(`  (inspect with: git -C ${tmp} show --stat)`);
      console.log(`  (temp dir left in place on purpose; delete it when done)`);
      process.exit(0);
    }

    // 4. Push -----------------------------------------------------------------
    run('git', ['-C', tmp, 'push', 'origin', `${branch}`]);
    pushed = true;
  }
} finally {
  if (!dryRun) rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n✓ ${pushed ? `${branch} updated` : 'nothing pushed'} — Pages rebuilds in ~1 minute.`);
console.log('  live at https://qjmotsamai.github.io/kaeduas/');
