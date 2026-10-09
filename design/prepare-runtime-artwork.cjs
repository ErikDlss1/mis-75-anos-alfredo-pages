const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'master-azul.svg'), 'utf8');
let runtime = source;

runtime = runtime.replace('<g transform="rotate(2 299 1904)" filter="url(#print-shadow)">', '<g id="photo-place" transform="rotate(2 299 1904)" filter="url(#print-shadow)">');
runtime = runtime.replace('  <!-- 04 / Pause: Foto 5, almost a full viewport, little or no copy. -->\n  <g clip-path="url(#pause-mask)">', '  <!-- 04 / Pause: Foto 5, almost a full viewport, little or no copy. -->\n  <g id="pause-photo" clip-path="url(#pause-mask)">');
runtime = runtime.replace('<text class="serif light" x="29" y="1424" font-size="43">36</text>', '<text id="countdown-static-days" visibility="hidden" class="serif light" x="29" y="1424" font-size="43">36</text>');
runtime = runtime.replace('<text class="serif light" x="144" y="1424" font-size="43">04</text>', '<text id="countdown-static-hours" visibility="hidden" class="serif light" x="144" y="1424" font-size="43">04</text>');
runtime = runtime.replace('<text class="serif light" x="264" y="1424" font-size="43">40</text>', '<text id="countdown-static-minutes" visibility="hidden" class="serif light" x="264" y="1424" font-size="43">40</text>');
runtime = runtime.replace('  <!-- 06 / Gifts: an actual folded letter held by the same seal. -->\n', '  <!-- 06 / Gifts: an actual folded letter held by the same seal. -->\n  <g id="gift-letter">\n');
runtime = runtime.replace('  <!-- 07 / RSVP: invitation and response form one ceremonial field. -->', '  </g>\n\n  <!-- 07 / RSVP: invitation and response form one ceremonial field. -->');
runtime = runtime.replace('<path d="M0 6140L390 6113V6840H0Z" fill="url(#ivory-paper)"/>', '<path id="closing-paper" d="M0 6140L390 6113V6840H0Z" fill="url(#ivory-paper)"/>');

for (const id of ['photo-place', 'pause-photo', 'gift-letter', 'closing-paper']) {
  if (!runtime.includes(`id="${id}"`)) throw new Error(`Missing runtime hook: ${id}`);
}
fs.writeFileSync(path.join(__dirname, 'master-runtime.svg'), runtime);
