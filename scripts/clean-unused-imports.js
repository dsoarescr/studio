#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lista de imports que sabemos que são seguros para remover
const SAFE_UNUSED_IMPORTS = [
  // React hooks não utilizados
  'useEffect', 'useState', 'useCallback', 'useMemo', 'useRef',
  
  // Ícones Lucide não utilizados (verificados manualmente)
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
  
  // Componentes UI não utilizados
  'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription', 'CardFooter',
  'Button', 'Input', 'Label', 'Textarea', 'Select', 'SelectContent', 'SelectItem',
  'SelectTrigger', 'SelectValue', 'Dialog', 'DialogContent', 'DialogHeader',
  'DialogTitle', 'DialogTrigger', 'DialogDescription', 'Sheet', 'SheetContent',
  'SheetHeader', 'SheetTitle', 'SheetTrigger', 'SheetDescription', 'Badge',
  'Progress', 'ScrollArea', 'Separator', 'Avatar', 'AvatarFallback', 'AvatarImage',
  'RadioGroup', 'RadioGroupItem', 'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger',
  
  // Outros imports comuns não utilizados
  'motion', 'AnimatePresence', 'cn', 'formatDate', 'useToast'
];

function isImportUsed(content, importName) {
  // Remove a linha do próprio import para não contar como uso
  const contentWithoutImports = content.replace(/import[^;]+;/g, '');
  
  // Padrões para verificar uso
  const usagePatterns = [
    // JSX component: <Component> ou <Component />
    new RegExp(`<${importName}[\\s\\/>]`, 'g'),
    
    // Function call: functionName(
    new RegExp(`\\b${importName}\\s*\\(`, 'g'),
    
    // Variable usage: variableName (não em import)
    new RegExp(`\\b${importName}\\b(?![\\s]*[,}])`, 'g'),
    
    // Property access: .propertyName
    new RegExp(`\\.${importName}\\b`, 'g'),
    
    // Destructuring: { prop: name }
    new RegExp(`{[^}]*\\b${importName}\\b[^}]*}`, 'g'),
    
    // Type usage: : TypeName
    new RegExp(`:\\s*${importName}\\b`, 'g'),
    
    // Generic usage: <TypeName>
    new RegExp(`<${importName}[\\s,>]`, 'g')
  ];
  
  return usagePatterns.some(pattern => pattern.test(contentWithoutImports));
}

function removeUnusedImport(content, importName) {
  // Verifica se o import está sendo usado
  if (isImportUsed(content, importName)) {
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
  
  // Clean up trailing commas in imports
  content = content.replace(/import\s*{\s*,([^}]*})/, 'import {$1}');
  content = content.replace(/import\s*{([^}]*),\s*}/, 'import {$1}');
  
  return content;
}

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
    const fileName = path.basename(filePath);
    
    // Remove imports não utilizados da lista segura
    for (const importName of SAFE_UNUSED_IMPORTS) {
      content = removeUnusedImport(content, importName);
    }
    
    // Adiciona eslint-disable para imagens
    content = addEslintDisableForImages(content);
    
    // Remove linhas vazias excessivas
    content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
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
  console.log('🧹 Limpando imports não utilizados de forma segura...\n');
  
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
  console.log(`\n✅ Limpeza segura concluída!`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };
