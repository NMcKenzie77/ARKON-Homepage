import { readFileSync, writeFileSync } from 'node:fs';

const packagePath = 'package.json';
const lockPath = 'package-lock.json';
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));

for (const dependencyName of Object.keys(packageJson.dependencies || {})) {
  const lockEntry = lock.packages?.[`node_modules/${dependencyName}`];
  if (!lockEntry?.version) throw new Error(`Could not resolve ${dependencyName} from package-lock.json.`);
  packageJson.dependencies[dependencyName] = lockEntry.version;
}

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log('Pinned package.json dependencies to the versions resolved in package-lock.json.');
