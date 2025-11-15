# @digitalcloud.no/safe-fs-plus

Safe, promise-based filesystem utilities for Node.js.

## Installation

```bash
npm install @digitalcloud.no/safe-fs-plus
```

## Features

- ✅ Promise-based async filesystem operations
- ✅ Safety checks to prevent dangerous operations
- ✅ Directory and file copying
- ✅ Safe removal with CWD protection
- ✅ Directory size calculation
- ✅ Temporary directory creation
- ✅ TypeScript support

## Usage

```typescript
import { 
  ensureDir, 
  removeSafe, 
  copyDir, 
  copyFileSafe,
  dirSize,
  createTempDir 
} from '@digitalcloud.no/safe-fs-plus';

// Ensure directory exists
await ensureDir('./my-folder');

// Safely remove files/directories (won't delete CWD)
await removeSafe('./temp-folder');

// Copy directory recursively
await copyDir('./source', './destination');

// Copy single file
await copyFileSafe('./file.txt', './backup/file.txt');

// Calculate directory size
const bytes = await dirSize('./my-folder');
console.log(`Size: ${bytes} bytes`);

// Create temporary directory
const tempPath = await createTempDir();
console.log(`Temp dir: ${tempPath}`);
```

## API

### `ensureDir(dirPath)`

Creates a directory and all parent directories if they don't exist.

### `removeSafe(targetPath, options?)`

Safely removes a file or directory. Prevents deletion of CWD by default.

**Options:**
- `allowOutsideCwd`: Allow deletion outside current working directory

### `copyFileSafe(src, dest)`

Copies a single file, creating destination directory if needed.

### `copyDir(src, dest)`

Recursively copies a directory and all its contents.

### `dirSize(dirPath)`

Calculates total size of directory in bytes.

### `createTempDir()`

Creates a temporary directory in the system temp folder.

## Safety Features

- **CWD Protection**: By default, won't delete the current working directory
- **Path Validation**: Validates paths before operations
- **Error Handling**: Proper error messages for common issues

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/safe-fs-plus)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
