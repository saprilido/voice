const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

// Find all array literals with objects containing id and title
let idx = 0;
while (true) {
  let found = code.indexOf('title:', idx);
  if (found === -1) break;
  console.log('--- title: at', found, '---');
  console.log(code.slice(Math.max(0, found - 100), Math.min(code.length, found + 400)));
  idx = found + 6;
}
