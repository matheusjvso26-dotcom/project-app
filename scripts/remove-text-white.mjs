import fs from 'fs';
import path from 'path';

const srcDirectory = path.join(process.cwd(), 'src/app/dashboard');

const replacements = {
  // Replace all text-white with text-foreground globally in dashboard
  'text-white': 'text-foreground',
  
  // Fix prominent colored backgrounds text that were broken by the above
  'bg-primary text-foreground': 'bg-primary text-primary-foreground',
  'bg-indigo-600 text-foreground': 'bg-indigo-600 text-white',
  'bg-blue-600 text-foreground': 'bg-blue-600 text-white',
  'bg-green-600 text-foreground': 'bg-green-600 text-white',
  'bg-red-600 text-foreground': 'bg-red-600 text-white',
  'bg-black text-foreground': 'bg-black text-white',
  'bg-zinc-900 text-foreground': 'bg-zinc-900 text-white',

  // Remaining `#333` borders
  'border-[#333]': 'border-border',
  'text-[#333]': 'text-muted-foreground',
};

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else {
      processFile(dirPath);
    }
  });
}

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    for (const [key, value] of Object.entries(replacements)) {
      content = content.split(key).join(value);
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated: ${filePath}`);
    }
  }
}

walkDir(srcDirectory);
console.log('Finished text-white replacements.');
