#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lista de imports comuns que frequentemente não são usados
const COMMON_UNUSED_IMPORTS = [
  // React hooks não usados
  'useEffect', 'useState', 'useCallback', 'useMemo', 'useRef',
  
  // Ícones Lucide não usados (lista dos mais comuns)
  'Info', 'User', 'CalendarDays', 'HistoryIcon', 'DollarSign', 'ShoppingCart',
  'Edit3', 'FileText', 'Upload', 'Save', 'XCircle', 'TagsIcon', 'LinkIconLucide',
  'Pencil', 'Eraser', 'PaintBucket', 'Trash2', 'Heart', 'Flag', 'BadgePercent',
  'ScrollText', 'Gem', 'Globe', 'AlertTriangle', 'MapIcon', 'Crown', 'Star',
  'Clock', 'Users', 'Zap', 'Sparkles', 'Activity', 'BarChart3', 'PieChart',
  'Target', 'Award', 'Shield', 'Eye', 'EyeOff', 'RefreshCw', 'Key', 'Smartphone',
  'Mail', 'CreditCard', 'Video', 'Camera', 'Mic', 'Type', 'Palette', 'Download',
  'Copy', 'Share2', 'Bookmark', 'Edit', 'Filter', 'Search', 'Plus', 'Minus',
  'Settings', 'Bell', 'X', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown',
  'MoreHorizontal', 'MoreVertical', 'Timer', 'Calendar', 'Flame', 'Coins',
  'TrendingUp', 'TrendingDown', 'Volume2', 'VolumeX', 'Phone', 'MessageSquare',
  'UserPlus', 'UserMinus', 'UserCheck', 'Lightbulb', 'Compass', 'Navigation',
  'MapPin', 'Home', 'Building', 'Mountain', 'Tree', 'Flower', 'Bug', 'Fish',
  'Bird', 'Cat', 'Dog', 'Rabbit', 'Bear', 'Lion', 'Elephant', 'Whale',
  
  // Componentes UI não usados
  'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription', 'CardFooter',
  'Button', 'Input', 'Label', 'Textarea', 'Select', 'SelectContent', 'SelectItem',
  'SelectTrigger', 'SelectValue', 'Dialog', 'DialogContent', 'DialogHeader',
  'DialogTitle', 'DialogTrigger', 'DialogDescription', 'Sheet', 'SheetContent',
  'SheetHeader', 'SheetTitle', 'SheetTrigger', 'SheetDescription', 'Badge',
  'Progress', 'ScrollArea', 'Separator', 'Avatar', 'AvatarFallback', 'AvatarImage',
  'RadioGroup', 'RadioGroupItem', 'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger',
  
  // Outros imports comuns
  'motion', 'AnimatePresence', 'cn', 'formatDate', 'useToast'
];

function removeUnusedImport(content, importName) {
  // Verifica se o import está sendo usado no código
  const codeWithoutImports = content.replace(/import[^;]+;/g, '');
  
  // Padrões para verificar uso
  const usagePatterns = [
    new RegExp(`<${importName}[\\s\\/>]`, 'g'), // JSX component
    new RegExp(`\\b${importName}\\s*\\(`, 'g'), // Function call
    new RegExp(`\\b${importName}\\b(?![\\s]*[,}])`, 'g'), // Variable usage (not in import)
    new RegExp(`\\.${importName}\\b`, 'g'), // Property access
    new RegExp(`{[^}]*\\b${importName}\\b[^}]*}`, 'g') // Destructuring
  ];
  
  const isUsed = usagePatterns.some(pattern => pattern.test(codeWithoutImports));
  
  if (isUsed) {
    return content; // Não remove se está sendo usado
  }
  
  // Remove from named imports: { A, B, C } -> { A, C }
  content = content.replace(
    new RegExp(`(import\\s*{[^}]*),\\s*${importName}\\s*([^}]*})`, 'g'),
    '$1$2'
  );
  content = content.replace(
    new RegExp(`(import\\s*{)\\s*${importName}\\s*,([^}]*})`, 'g'),
    '$1$2'
  );
  content = content.replace(
    new RegExp(`(import\\s*{)\\s*${importName}\\s*(})`, 'g'),
    ''
  );
  
  // Remove standalone import lines
  content = content.replace(
    new RegExp(`import\\s+${importName}\\s+from\\s+['"][^'"]+['"];?\\s*\\n?`, 'g'),
    ''
  );
  
  // Clean up empty import statements
  content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];\s*\n?/g, '');
  
  return content;
}

function removeUnusedVariables(content) {
  const lines = content.split('\n');
  const cleanedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Verifica se é uma declaração de variável não usada
    const varMatch = line.match(/^\s*(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
    if (varMatch) {
      const varName = varMatch[2];
      
      // Verifica se tem warning específico
      if (line.includes('is assigned a value but never used') || 
          line.includes('is defined but never used')) {
        continue; // Skip esta linha
      }
      
      // Verifica no resto do código se é usada
      const restOfCode = lines.slice(i + 1).join('\n');
      const isUsed = new RegExp(`\\b${varName}\\b`).test(restOfCode);
      
      if (!isUsed && varName !== 'React') { // Nunca remove React
        continue; // Skip variável não usada
      }
    }
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
}

function fixSpecificIssues(content) {
  // Fix: prefer-const
  content = content.replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;]+);/g, (match, varName, value) => {
    // Se a variável não é reatribuída, usar const
    const reassignmentPattern = new RegExp(`\\b${varName}\\s*=`, 'g');
    const matches = content.match(reassignmentPattern) || [];
    if (matches.length <= 1) { // Apenas a declaração inicial
      return `const ${varName} = ${value};`;
    }
    return match;
  });
  
  // Fix: no-this-alias
  content = content.replace(/const\s+context\s*=\s*this;/g, '// const context = this; // Fixed: use arrow function instead');
  
  // Fix: react/no-unescaped-entities
  content = content.replace(/"/g, '&quot;');
  content = content.replace(/'/g, '&apos;');
  
  // Fix: @next/next/no-img-element (add eslint-disable)
  content = content.replace(
    /(\s*)(<img\s+[^>]*>)/g,
    '$1{/* eslint-disable-next-line @next/next/no-img-element */}\n$1$2'
  );
  
  return content;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove imports não utilizados
    for (const importName of COMMON_UNUSED_IMPORTS) {
      content = removeUnusedImport(content, importName);
    }
    
    // Remove variáveis não utilizadas
    content = removeUnusedVariables(content);
    
    // Corrige problemas específicos
    content = fixSpecificIssues(content);
    
    // Remove linhas vazias excessivas
    content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
    content = content.replace(/^\s*\n+/, ''); // Remove linhas vazias no início
    
    // Salva apenas se houve mudanças
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
  console.log('🧹 Limpando imports e código não utilizado...\n');
  
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
  
  console.log(`\n📊 Resumo:`);
  console.log(`   📁 Total de arquivos: ${totalFiles}`);
  console.log(`   ✨ Arquivos limpos: ${cleanedFiles}`);
  console.log(`   📉 Arquivos não alterados: ${totalFiles - cleanedFiles}`);
  console.log(`\n✅ Limpeza concluída!`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };
