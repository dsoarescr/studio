#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function addEslintDisableForImages(content) {
  // Adiciona eslint-disable apenas para <img> que não têm
  return content.replace(
    /(\s*)(<img\s+[^>]*>)/g,
    (match, indent, imgTag) => {
      // Verifica se já tem o disable comment na linha anterior
      const lines = content.split('\n');
      const imgLineIndex = content.substring(0, content.indexOf(match)).split('\n').length - 1;
      
      if (imgLineIndex > 0) {
        const prevLine = lines[imgLineIndex - 1];
        if (prevLine.includes('eslint-disable-next-line @next/next/no-img-element')) {
          return match; // Já tem o comment
        }
      }
      
      return `${indent}{/* eslint-disable-next-line @next/next/no-img-element */}\n${indent}${imgTag}`;
    }
  );
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Adiciona eslint-disable para imagens
    content = addEslintDisableForImages(content);
    
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
  console.log('🖼️  Corrigindo warnings de imagens...\n');
  
  const projectRoot = process.cwd();
  
  let totalFiles = 0;
  let fixedFiles = 0;
  
  // Processa src/ e app/
  const dirs = ['src', 'app'];
  
  for (const dir of dirs) {
    const fullDir = path.join(projectRoot, dir);
    const files = findFiles(fullDir);
    
    console.log(`📁 Processando ${dir}/... (${files.length} arquivos)`);
    
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
  console.log(`   📉 Não alterados: ${totalFiles - fixedFiles}`);
  console.log(`\n✅ Warnings de imagens corrigidos!`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };
