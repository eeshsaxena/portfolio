/**
 * Assembles the standalone builds into the Remix (2D) project's public/ so the
 * whole site ships as ONE Cloudflare Pages project on eeshsaxena.com:
 *
 *   /        -> 2D Remix site (owns the domain + Functions)
 *   /3d/     -> 3D scene (webpack build, copied here)
 *   /os/     -> EeshOS, embedded in the 3D monitor via an /os/index.html iframe
 *
 * Run after the webpack build (see `npm run build:unified`). The destination
 * folders are generated artifacts and are gitignored.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const build3d = path.join(root, 'public'); // webpack output
const osSrc = path.join(root, 'static', 'os');
const remixPublic = path.join(root, 'portfolio-master', 'portfolio-master', 'public');
const dest3d = path.join(remixPublic, '3d');
const destOs = path.join(remixPublic, 'os');

function reset(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(build3d) || !fs.existsSync(path.join(build3d, 'index.html'))) {
  console.error('No 3D build found. Run `npm run build` (webpack) first.');
  process.exit(1);
}

reset(dest3d);
fs.cpSync(build3d, dest3d, { recursive: true });

reset(destOs);
fs.cpSync(osSrc, destOs, { recursive: true });

// Ship the résumé PDF at the domain root (/resume.pdf) so both the 2D
// /resume page and the 3D OS resume window can link to it.
const resumeSrc = path.join(root, 'static', 'resume.pdf');
if (fs.existsSync(resumeSrc)) {
  fs.cpSync(resumeSrc, path.join(remixPublic, 'resume.pdf'));
}

// Drop the stale single-file copy from earlier hand-assembly, if present.
fs.rmSync(path.join(remixPublic, '3d.html'), { force: true });

console.log('Assembled: 3D -> public/3d, OS -> public/os');
