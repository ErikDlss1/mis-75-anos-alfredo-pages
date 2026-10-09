const fs = require('node:fs');
const path = require('node:path');

const designDir = __dirname;
const projectDir = path.resolve(designDir, '..');
let svg = fs.readFileSync(path.join(designDir, 'sobre-cerrado.svg'), 'utf8');
for (const [relative, mime] of Object.entries({
  '../assets/texture/papel-navy-web.jpg': 'image/jpeg',
  '../assets/texture/papel-marfil-web.jpg': 'image/jpeg',
  '../assets/graphics/sello-oro-web.png': 'image/png',
})) {
  const bytes = fs.readFileSync(path.resolve(projectDir, relative.replace(/^\.\.\//, '')));
  svg = svg.split(relative).join(`data:${mime};base64,${bytes.toString('base64')}`);
}
fs.writeFileSync(path.join(designDir, 'sobre-cerrado-embedded.svg'), svg);
