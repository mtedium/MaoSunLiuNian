const fs = require('fs');
const path = require('path');

const mappings = [
  { regex: /bg-stone-700/g, replacement: 'bg-border-subtle' },
  { regex: /bg-stone-600/g, replacement: 'bg-border-default' },
  { regex: /bg-stone-50/g, replacement: 'bg-bg-surface' },
  { regex: /hover:bg-stone-700/g, replacement: 'hover:bg-border-subtle' },
  { regex: /hover:bg-stone-600/g, replacement: 'hover:bg-border-default' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.vue')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let newContent = content;

      for (const { regex, replacement } of mappings) {
        newContent = newContent.replace(regex, replacement);
      }

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'app'));
