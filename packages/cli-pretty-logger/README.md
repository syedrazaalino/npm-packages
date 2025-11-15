# @digitalcloud.no/cli-pretty-logger

Simple colored logger for CLI applications.

## Installation

```bash
npm install @digitalcloud.no/cli-pretty-logger
```

## Features

- ✅ Colored console output
- ✅ Multiple log levels (debug, info, warn, error)
- ✅ Configurable minimum log level
- ✅ Timestamp support
- ✅ TypeScript support
- ✅ Zero dependencies

## Usage

```typescript
import { createLogger } from '@digitalcloud.no/cli-pretty-logger';

const logger = createLogger({ level: 'info' });

logger.debug('Debug message');  // Won't show (below 'info')
logger.info('Info message');    // Blue
logger.warn('Warning message'); // Yellow
logger.error('Error message');  // Red

// With timestamps
const loggerWithTime = createLogger({ 
  level: 'debug',
  timestamp: true 
});

loggerWithTime.info('Starting application...');
```

## API

### `createLogger(options?)`

Creates a new logger instance.

**Options:**
- `level`: Minimum log level (`'debug'` | `'info'` | `'warn'` | `'error'`)
- `timestamp`: Include timestamps in output (default: false)

**Methods:**
- `debug(...args)`: Debug level (gray)
- `info(...args)`: Info level (blue)
- `warn(...args)`: Warning level (yellow)
- `error(...args)`: Error level (red)

## Log Levels

Levels in order of severity:
1. `debug` - Detailed debugging information
2. `info` - General informational messages
3. `warn` - Warning messages
4. `error` - Error messages

Setting a minimum level filters out lower-priority messages.

## Examples

```typescript
// Production logger (only warnings and errors)
const prodLogger = createLogger({ level: 'warn' });

// Development logger (all messages)
const devLogger = createLogger({ level: 'debug', timestamp: true });

// Simple usage
devLogger.info('Server started on port', 3000);
devLogger.error('Failed to connect:', error);
```

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/cli-pretty-logger)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
