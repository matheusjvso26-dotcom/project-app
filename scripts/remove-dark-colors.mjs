import fs from 'fs';
import path from 'path';

const srcDirectory = path.join(process.cwd(), 'src');

const replacements = {
  // Backgrounds
  'bg-[#151515]': 'bg-background',
  'bg-[#1c1c1c]': 'bg-card',
  'bg-[#1a1a1a]': 'bg-muted',
  'bg-[#111111]': 'bg-background',
  
  // Borders
  'border-[#333]': 'border-border',
  'border-white/5': 'border-border/50',
  'border-white/10': 'border-border',
  'border-border/20': 'border-border',
  
  // Text colors specifically from zinc shades
  'text-zinc-200': 'text-foreground',
  'text-zinc-300': 'text-foreground',
  'text-zinc-400': 'text-muted-foreground',
  'text-zinc-500': 'text-muted-foreground',
  'text-zinc-600': 'text-muted-foreground'
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
console.log('Finished updating colors.');
