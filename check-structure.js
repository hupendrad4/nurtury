const fs = require('fs');
const path = require('path');

// List of required files and directories
const requiredFiles = [
  'apps/web/src/components/ui/button.tsx',
  'apps/web/src/components/ui/card.tsx',
  'apps/web/src/components/ui/tabs.tsx',
  'apps/web/src/components/ui/skeleton.tsx',
  'apps/web/src/components/ui/empty-state.tsx',
  'apps/web/src/components/icons.tsx',
  'apps/web/src/types/order.ts',
  'apps/web/src/lib/utils.ts',
  'apps/web/tsconfig.json',
  'apps/web/next.config.js'
];

// Check each required file
console.log('Checking project structure...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  
  if (!exists) {
    allFilesExist = false;
    console.log(`   Missing: ${fullPath}`);
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files are present!');
  console.log('You may need to restart your development server for changes to take effect.');
} else {
  console.log('\n❌ Some required files are missing. Please check the list above.');
}

// Check for required dependencies
console.log('\nChecking for required dependencies...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const requiredDeps = [
  '@radix-ui/react-slot',
  '@radix-ui/react-tabs',
  'class-variance-authority',
  'tailwind-merge',
  'lucide-react',
  '@tanstack/react-query'
];

let allDepsExist = true;

requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
  console.log(`${exists ? '✅' : '❌'} ${dep}`);
  
  if (!exists) {
    allDepsExist = false;
    console.log(`   Missing dependency: ${dep}`);
  }
});

if (allDepsExist) {
  console.log('\n✅ All required dependencies are installed!');
} else {
  console.log('\n❌ Some required dependencies are missing. Please run:');
  console.log('   pnpm add ' + requiredDeps.join(' '));
}
