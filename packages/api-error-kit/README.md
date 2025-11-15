# @digitalcloud.no/api-error-kit

Standardized API error shape and helpers for backend and frontend.

## Installation

```bash
npm install @digitalcloud.no/api-error-kit
```

## Features

- ✅ Consistent error structure across your API
- ✅ Express middleware for error handling
- ✅ TypeScript support with full type safety
- ✅ Error normalization utilities
- ✅ HTTP status code support
- ✅ Custom error details

## Usage

### Basic Error Creation

```typescript
import { ApiError, createApiError } from '@digitalcloud.no/api-error-kit';

// Create an API error
const error = createApiError('not_found', 'User not found', {
  status: 404,
  details: { userId: 123 }
});

throw error;
```

### Express Middleware

```typescript
import express from 'express';
import { createExpressErrorMiddleware } from '@digitalcloud.no/api-error-kit';

const app = express();

// Your routes here
app.get('/users/:id', (req, res) => {
  throw createApiError('not_found', 'User not found', { status: 404 });
});

// Add error middleware at the end
app.use(createExpressErrorMiddleware({
  log: (error, req) => console.error(error),
  defaultStatus: 500
}));
```

### Error Normalization

```typescript
import { normalizeError, toErrorResponse } from '@digitalcloud.no/api-error-kit';

try {
  // Some operation
} catch (err) {
  const apiError = normalizeError(err);
  const response = toErrorResponse(apiError);
  
  res.status(response.status).json(response.body);
}
```

## API

### `ApiError`

Custom error class with standardized structure.

### `createApiError(code, message, options?)`

Creates a new ApiError instance.

### `normalizeError(error, defaultStatus?)`

Converts any error to ApiError format.

### `toErrorResponse(error)`

Converts error to HTTP response format.

### `createExpressErrorMiddleware(options?)`

Creates Express error handling middleware.

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/api-error-kit)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
