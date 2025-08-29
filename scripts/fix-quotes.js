#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixQuotes(content) {
  // Reverte as substituições problemáticas
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&apos;/g, "'");
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&rbrace;/g, '}');
  content = content.replace(/&lbrace;/g, '{');

  return content;
}

function fixSpecificIssues(content, filePath) {
  // Fix específico para SecurityDashboard.tsx
  if (filePath.includes('SecurityDashboard.tsx')) {
    content = content.replace(
      /Shield, Lock, Smartphone, AlertTriangle, CheckCircle, LogOut, Laptopas SmartphoneIcon,/,
      'Shield, Lock, Smartphone, AlertTriangle, CheckCircle, LogOut, Laptop,'
    );
  }

  // Fix para imports quebrados
  content = content.replace(/from\s+"([^"]+)";?\s*\nfrom/g, 'from "$1";\nfrom');
  content = content.replace(/import\s+([^;]+);\s*\nfrom/g, 'import $1;\nfrom');

  return content;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    content = fixQuotes(content);
    content = fixSpecificIssues(content, filePath);

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corrigido: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

function findFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  console.log('🔧 Corrigindo problemas de aspas...\n');

  const projectRoot = process.cwd();

  let totalFiles = 0;
  let fixedFiles = 0;

  // Processa src/ e app/
  const dirs = ['src', 'app'];

  for (const dir of dirs) {
    const fullDir = path.join(projectRoot, dir);
    const files = findFiles(fullDir);

    for (const file of files) {
      totalFiles++;
      if (processFile(file)) {
        fixedFiles++;
      }
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   📁 Total: ${totalFiles} arquivos`);
  console.log(`   ✅ Corrigidos: ${fixedFiles} arquivos`);
  console.log(`   ✅ Aspas corrigidas!`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };
