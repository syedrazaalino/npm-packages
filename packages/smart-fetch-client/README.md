# @digitalcloud.no/smart-fetch-client

Fetch-based HTTP client with retries, timeouts, and typed responses.

## Installation

```bash
npm install @digitalcloud.no/smart-fetch-client
```

## Features

- ✅ Built on native `fetch` API
- ✅ Automatic retries with exponential backoff
- ✅ Request timeouts
- ✅ TypeScript support with typed responses
- ✅ Query parameter handling
- ✅ Base URL configuration
- ✅ Custom headers and interceptors

## Usage

```typescript
import { createClient } from '@digitalcloud.no/smart-fetch-client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retry: { attempts: 3, delay: 1000 },
  headers: { 'Authorization': 'Bearer token' }
});

// GET request with typed response
const user = await client.get<{ id: number; name: string }>('/users/1');
console.log(user.id, user.name);

// POST request
const newUser = await client.post('/users', {
  body: { name: 'John Doe', email: 'john@example.com' }
});

// With query parameters
const users = await client.get('/users', {
  query: { page: 1, limit: 10 }
});
```

## API

### `createClient(options)`

Creates a new HTTP client instance.

**Options:**
- `baseUrl`: Base URL for all requests
- `timeout`: Request timeout in milliseconds
- `retry`: Retry configuration `{ attempts, delay }`
- `headers`: Default headers for all requests
- `fetch`: Custom fetch implementation

**Methods:**
- `get<T>(path, options?)`: GET request
- `post<T>(path, options?)`: POST request
- `put<T>(path, options?)`: PUT request
- `patch<T>(path, options?)`: PATCH request
- `delete<T>(path, options?)`: DELETE request

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/smart-fetch-client)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
