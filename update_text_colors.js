const fs = require('node:fs');
const path = require('node:path');

const targetColor = 'text-amber-300';

function updateFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = fileContent.replace(/(\btext-\w+\b)\s*:\s*['"]?\w+['"]?/g, `$1: ${targetColor}`);
  fs.writeFileSync(filePath, updatedContent);
}

const directoryPath = path.join(process.cwd(), 'frontend', 'src', 'pages');

const files = fs.readdirSync(directoryPath);

files.forEach(file => {
  if (path.extname(file) === '.jsx') {
    const filePath = path.join(directoryPath, file);
    updateFile(filePath);
    console.log(`Updated file: ${filePath}`);
  }
});

console.log('Text color updates complete.');
