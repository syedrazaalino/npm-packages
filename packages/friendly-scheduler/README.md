# @digitalcloud.no/friendly-scheduler

Friendly in-process interval scheduler for Node.js and TypeScript.

## Installation

```bash
npm install @digitalcloud.no/friendly-scheduler
```

## Features

- ✅ Simple interval-based job scheduling
- ✅ Human-readable time formats (`1s`, `5m`, `1h`)
- ✅ Async/await support
- ✅ Job cancellation
- ✅ TypeScript support
- ✅ Zero dependencies

## Usage

```typescript
import { every } from '@digitalcloud.no/friendly-scheduler';

// Schedule a job every 5 seconds
const job = every('5s', async () => {
  console.log('Running scheduled task...');
  await doSomething();
});

// Run immediately and then every 10 minutes
const job2 = every('10m', myTask, { immediate: true });

// Cancel a job
job.cancel();

// Check if job is running
if (job.isRunning()) {
  console.log('Job is currently executing');
}
```

## API

### `every(interval, fn, options?)`

Schedules a function to run at regular intervals.

**Parameters:**
- `interval`: Time interval as number (ms) or string (`'1s'`, `'5m'`, `'1h'`, `'1d'`)
- `fn`: Function to execute (can be async)
- `options`: Configuration object
  - `immediate`: Run immediately before first interval (default: false)

**Returns:** Job object with methods:
- `cancel()`: Stop the scheduled job
- `isRunning()`: Check if job is currently executing

## Time Format

Supported time units:
- `ms` - milliseconds
- `s` - seconds
- `m` - minutes
- `h` - hours
- `d` - days

Examples: `'500ms'`, `'30s'`, `'5m'`, `'2h'`, `'1d'`

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/friendly-scheduler)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
