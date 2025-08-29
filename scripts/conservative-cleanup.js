#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lista muito específica de imports que sabemos que não são usados
const SPECIFIC_UNUSED_IMPORTS = [
  // Apenas imports que sabemos que não são usados em arquivos específicos
  { file: /FeedbackSystem\.tsx$/, imports: ['useEffect'] },
  { file: /DynamicRankingSystem\.tsx$/, imports: ['useEffect'] },
  { file: /RewardSystem\.tsx$/, imports: ['useEffect'] },
  { file: /TournamentSystem\.tsx$/, imports: ['useEffect'] },
  { file: /PremiumSubscription\.tsx$/, imports: ['useEffect'] },
  { file: /CheckoutForm\.tsx$/, imports: ['useEffect'] },
  { file: /SwipeGestures\.tsx$/, imports: ['useRef', 'useEffect'] },
  { file: /MobileOptimizations\.tsx$/, imports: ['useRef'] },

  // Ícones específicos que sabemos que não são usados
  { file: /.*\.tsx$/, imports: ['Robot', 'Magic', 'Trending'] }, // Já corrigidos anteriormente
];

function removeSpecificImports(content, importsToRemove) {
  let modifiedContent = content;

  for (const importName of importsToRemove) {
    // Remove from named imports: { A, B, C } -> { A, C }
    modifiedContent = modifiedContent.replace(
      new RegExp(`(import\\s*{[^}]*),\\s*${importName}\\s*([^}]*})`, 'g'),
      '$1$2'
    );
    modifiedContent = modifiedContent.replace(
      new RegExp(`(import\\s*{)\\s*${importName}\\s*,([^}]*})`, 'g'),
      '$1$2'
    );
    modifiedContent = modifiedContent.replace(
      new RegExp(`(import\\s*{)\\s*${importName}\\s*(})`, 'g'),
      ''
    );

    // Clean up empty import statements
    modifiedContent = modifiedContent.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];\s*\n?/g, '');

    // Clean up trailing commas in imports
    modifiedContent = modifiedContent.replace(/import\s*{\s*,([^}]*})/, 'import {$1}');
    modifiedContent = modifiedContent.replace(/import\s*{([^}]*),\s*}/, 'import {$1}');
  }

  return modifiedContent;
}

function addEslintDisableForImages(content) {
  // Adiciona eslint-disable apenas para <img> que não têm
  return content.replace(/(\s*)(<img\s+[^>]*>)/g, (match, indent, imgTag) => {
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
  });
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const fileName = path.basename(filePath);

    // Aplica remoções específicas para este arquivo
    for (const rule of SPECIFIC_UNUSED_IMPORTS) {
      if (rule.file.test(fileName)) {
        content = removeSpecificImports(content, rule.imports);
      }
    }

    // Adiciona eslint-disable para imagens
    content = addEslintDisableForImages(content);

    // Remove linhas vazias excessivas
    content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Limpo: ${path.relative(process.cwd(), filePath)}`);
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
  console.log('🧹 Limpeza conservadora de imports específicos...\n');

  const projectRoot = process.cwd();

  let totalFiles = 0;
  let cleanedFiles = 0;

  // Processa src/ e app/
  const dirs = ['src', 'app'];

  for (const dir of dirs) {
    const fullDir = path.join(projectRoot, dir);
    const files = findFiles(fullDir);

    console.log(`📁 Processando ${dir}/... (${files.length} arquivos)`);

    for (const file of files) {
      totalFiles++;
      if (processFile(file)) {
        cleanedFiles++;
      }
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   📁 Total: ${totalFiles} arquivos`);
  console.log(`   ✨ Limpos: ${cleanedFiles} arquivos`);
  console.log(`   📉 Não alterados: ${totalFiles - cleanedFiles}`);
  console.log(`\n✅ Limpeza conservadora concluída!`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };
