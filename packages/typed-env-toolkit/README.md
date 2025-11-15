# @digitalcloud.no/typed-env-toolkit

Type-safe environment variable loader with runtime validation for Node.js and TypeScript.

## Installation

```bash
npm install @digitalcloud.no/typed-env-toolkit
```

## Features

- ✅ Type-safe environment variable loading
- ✅ Runtime validation with custom validators
- ✅ Support for required and optional variables
- ✅ Default values for optional variables
- ✅ JSON parsing support
- ✅ Detailed error messages

## Usage

```typescript
import { defineEnv } from '@digitalcloud.no/typed-env-toolkit';

const env = defineEnv({
  NODE_ENV: { required: true },
  PORT: { 
    required: false, 
    default: '3000',
    validate: (val) => !isNaN(Number(val))
  },
  DATABASE_URL: { required: true },
  FEATURES: { 
    required: false, 
    parse: (val) => JSON.parse(val) 
  }
});

console.log(env.PORT); // Type-safe access
```

## API

### `defineEnv(schema)`

Defines and validates environment variables based on a schema.

**Parameters:**
- `schema`: Object mapping variable names to their configuration
  - `required`: boolean - Whether the variable is required
  - `default`: string - Default value if not provided
  - `validate`: function - Custom validation function
  - `parse`: function - Custom parser function

**Returns:** Typed object with validated environment variables

**Throws:** `EnvError` if validation fails

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/typed-env-toolkit)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
