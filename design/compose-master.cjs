const fs = require('node:fs');
const path = require('node:path');

const opening = fs.readFileSync(path.join(__dirname, 'sobre-cerrado-embedded.svg'));
const invitation = fs.readFileSync(path.join(__dirname, 'master-azul-embedded.svg'));
const uri = (bytes) => `data:image/svg+xml;base64,${bytes.toString('base64')}`;
const height = 844 + 6840;
const composite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 ${height}" width="390" height="${height}" role="img" aria-labelledby="title desc">
  <title id="title">Master visual completo · Mis 75 años · Alfredo</title>
  <desc id="desc">La apertura con sobre cerrado seguida por la invitación vertical completa. El mapa real se integra en la ventana reservada al lugar durante la visualización y en la web.</desc>
  <image x="0" y="0" width="390" height="844" href="${uri(opening)}"/>
  <image x="0" y="844" width="390" height="6840" href="${uri(invitation)}"/>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'master-completo.svg'), composite);
