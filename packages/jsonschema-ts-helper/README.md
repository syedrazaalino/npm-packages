# @digitalcloud.no/jsonschema-ts-helper

Generate TypeScript types from JSON Schema.

## Installation

```bash
npm install @digitalcloud.no/jsonschema-ts-helper
```

## Features

- ✅ Convert JSON Schema to TypeScript interfaces
- ✅ Support for common JSON Schema types
- ✅ Nested object support
- ✅ Array type handling
- ✅ CLI tool included
- ✅ Programmatic API

## Usage

### CLI

```bash
# Generate TypeScript types from JSON Schema file
npx jsonschema-ts input.json output.ts

# Or if installed globally
jsonschema-ts schema.json types.ts
```

### Programmatic API

```typescript
import { generateTypes } from '@digitalcloud.no/jsonschema-ts-helper';

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string' },
    active: { type: 'boolean' }
  },
  required: ['id', 'name']
};

const typescript = generateTypes(schema, 'User');
console.log(typescript);
// Output:
// export interface User {
//   id: number;
//   name: string;
//   email?: string;
//   active?: boolean;
// }
```

## API

### `generateTypes(schema, interfaceName?)`

Generates TypeScript interface from JSON Schema.

**Parameters:**
- `schema`: JSON Schema object
- `interfaceName`: Name for the generated interface (default: 'GeneratedType')

**Returns:** TypeScript interface as string

## Supported JSON Schema Types

- `string` → `string`
- `number` → `number`
- `integer` → `number`
- `boolean` → `boolean`
- `array` → `Array<T>`
- `object` → nested interface
- `null` → `null`

## Example

Input JSON Schema:
```json
{
  "type": "object",
  "properties": {
    "user": {
      "type": "object",
      "properties": {
        "id": { "type": "number" },
        "tags": { 
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
```

Output TypeScript:
```typescript
export interface GeneratedType {
  user?: {
    id?: number;
    tags?: string[];
  };
}
```

## Contributing

Contributions are welcome! This package is part of the [npm-packages](https://github.com/syedrazaalino/npm-packages) monorepo.

## License

MIT © [digitalcloud.no](https://digitalcloud.no)

## Links

- [GitHub Repository](https://github.com/syedrazaalino/npm-packages)
- [npm Package](https://www.npmjs.com/package/@digitalcloud.no/jsonschema-ts-helper)
- [Report Issues](https://github.com/syedrazaalino/npm-packages/issues)
