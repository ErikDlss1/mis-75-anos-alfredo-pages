const fs = require('node:fs');
const path = require('node:path');

const designDir = __dirname;
const projectDir = path.resolve(designDir, '..');
let svg = fs.readFileSync(path.join(designDir, 'master-azul.svg'), 'utf8');
const assets = {
  '../assets/texture/papel-marfil-web.jpg': 'image/jpeg',
  '../assets/texture/papel-navy-web.jpg': 'image/jpeg',
  '../assets/graphics/sello-oro-web.png': 'image/png',
  '../assets/photos/foto-02.jpg': 'image/jpeg',
  '../assets/photos/foto-04.jpg': 'image/jpeg',
  '../assets/photos/foto-05.jpg': 'image/jpeg',
  '../assets/photos/foto-07.jpg': 'image/jpeg',
  '../assets/photos/foto-08.jpg': 'image/jpeg',
};

for (const [relative, mime] of Object.entries(assets)) {
  const bytes = fs.readFileSync(path.resolve(projectDir, relative.replace(/^\.\.\//, '')));
  svg = svg.split(relative).join(`data:${mime};base64,${bytes.toString('base64')}`);
}

fs.writeFileSync(path.join(designDir, 'master-azul-embedded.svg'), svg);
