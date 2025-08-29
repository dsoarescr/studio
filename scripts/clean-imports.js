#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Padrões para detectar imports não utilizados
const IMPORT_PATTERNS = {
  // Imports nomeados: import { A, B, C } from 'module'
  namedImports: /import\s*{\s*([^}]+)\s*}\s*from\s*['"][^'"]+['"];?\s*\n?/g,

  // Imports default: import Something from 'module'
  defaultImports: /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"][^'"]+['"];?\s*\n?/g,

  // Imports com alias: import * as Something from 'module'
  namespaceImports:
    /import\s*\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"][^'"]+['"];?\s*\n?/g,
};

// Padrões para detectar uso de variáveis/funções
const USAGE_PATTERNS = {
  // Uso em JSX: <Component> ou <Component />
  jsxComponent: name => new RegExp(`<${name}[\\s/>]`, 'g'),

  // Uso como função: functionName(
  functionCall: name => new RegExp(`\\b${name}\\s*\\(`, 'g'),

  // Uso como variável: variableName
  variable: name => new RegExp(`\\b${name}\\b`, 'g'),

  // Uso em destructuring: { prop: name }
  destructuring: name => new RegExp(`{[^}]*\\b${name}\\b[^}]*}`, 'g'),
};

function isUsedInCode(name, content) {
  // Remove a linha do próprio import para não contar como uso
  const contentWithoutImports = content.replace(/import[^;]+;/g, '');

  // Verifica diferentes padrões de uso
  const patterns = [
    USAGE_PATTERNS.jsxComponent(name),
    USAGE_PATTERNS.functionCall(name),
    USAGE_PATTERNS.variable(name),
  ];

  return patterns.some(pattern => pattern.test(contentWithoutImports));
}

function cleanNamedImports(content) {
  return content.replace(IMPORT_PATTERNS.namedImports, (match, imports, offset) => {
    const importNames = imports.split(',').map(name => name.trim());
    const usedImports = importNames.filter(name => isUsedInCode(name, content));

    if (usedImports.length === 0) {
      // Remove toda a linha de import se nenhum import é usado
      return '';
    } else if (usedImports.length < importNames.length) {
      // Reconstrói o import apenas com os imports usados
      const importLine = match.replace(/{\s*[^}]+\s*}/, `{ ${usedImports.join(', ')} }`);
      return importLine;
    }

    return match;
  });
}

function removeUnusedVariables(content) {
  // Remove declarações de variáveis não utilizadas (padrão simples)
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    // Skip se não é uma declaração de variável
    if (!line.trim().match(/^(const|let|var)\s+/)) {
      return true;
    }

    // Extrai o nome da variável
    const match = line.match(/^(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (!match) return true;

    const varName = match[2];

    // Verifica se é usada no resto do código
    const restOfCode = lines.slice(lines.indexOf(line) + 1).join('\n');
    return isUsedInCode(varName, restOfCode);
  });

  return cleanedLines.join('\n');
}

function fixQuotes(content) {
  // Substitui aspas duplas por &quot; em strings JSX quando necessário
  return content.replace(/(\w+="[^"]*)"([^"]*)"([^"]*")/g, '$1&quot;$2&quot;$3');
}

function fixImages(content) {
  // Adiciona comentário para suprimir warning de <img>
  return content.replace(
    /<img\s+([^>]*)\s*\/?>/g,
    '// eslint-disable-next-line @next/next/no-img-element\n      <img $1 />'
  );
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let cleanedContent = content;

    // Aplica as limpezas
    cleanedContent = cleanNamedImports(cleanedContent);
    cleanedContent = removeUnusedVariables(cleanedContent);
    cleanedContent = fixQuotes(cleanedContent);

    // Remove linhas vazias excessivas
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Escreve o arquivo apenas se houve mudanças
    if (cleanedContent !== content) {
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findTypeScriptFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTypeScriptFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  console.log('🧹 Iniciando limpeza de imports e código...\n');

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const appDir = path.join(projectRoot, 'app');

  let totalFiles = 0;
  let cleanedFiles = 0;

  // Processa arquivos src/
  if (fs.existsSync(srcDir)) {
    const srcFiles = findTypeScriptFiles(srcDir);
    for (const file of srcFiles) {
      totalFiles++;
      if (processFile(file)) {
        cleanedFiles++;
      }
    }
  }

  // Processa arquivos app/
  if (fs.existsSync(appDir)) {
    const appFiles = findTypeScriptFiles(appDir);
    for (const file of appFiles) {
      totalFiles++;
      if (processFile(file)) {
        cleanedFiles++;
      }
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   📁 Arquivos processados: ${totalFiles}`);
  console.log(`   ✨ Arquivos limpos: ${cleanedFiles}`);
  console.log(`   ✅ Limpeza concluída!`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findTypeScriptFiles };
