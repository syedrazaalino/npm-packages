# NPM Packages Monorepo

A collection of 7 production-ready TypeScript utility packages published under `@digitalcloud.no`.

**Contribution to:** [digitalcloud.no](https://digitalcloud.no)

## 📦 Packages

### 1. [@digitalcloud.no/typed-env-toolkit](./packages/typed-env-toolkit)

Type-safe environment variable loader with runtime validation for Node.js and TypeScript.

```bash
npm install @digitalcloud.no/typed-env-toolkit
```

**Features:** Type-safe env loading, runtime validation, default values, JSON parsing

[📖 Documentation](./packages/typed-env-toolkit/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/typed-env-toolkit)

---

### 2. [@digitalcloud.no/smart-fetch-client](./packages/smart-fetch-client)

Fetch-based HTTP client with retries, timeouts, and typed responses.

```bash
npm install @digitalcloud.no/smart-fetch-client
```

**Features:** Automatic retries, timeouts, TypeScript support, query parameters

[📖 Documentation](./packages/smart-fetch-client/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/smart-fetch-client)

---

### 3. [@digitalcloud.no/api-error-kit](./packages/api-error-kit)

Standardized API error shape and helpers for backend and frontend.

```bash
npm install @digitalcloud.no/api-error-kit
```

**Features:** Consistent error structure, Express middleware, error normalization

[📖 Documentation](./packages/api-error-kit/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/api-error-kit)

---

### 4. [@digitalcloud.no/friendly-scheduler](./packages/friendly-scheduler)

Friendly in-process interval scheduler for Node.js and TypeScript.

```bash
npm install @digitalcloud.no/friendly-scheduler
```

**Features:** Simple intervals, human-readable formats, async support, job cancellation

[📖 Documentation](./packages/friendly-scheduler/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/friendly-scheduler)

---

### 5. [@digitalcloud.no/safe-fs-plus](./packages/safe-fs-plus)

Safe, promise-based filesystem utilities for Node.js.

```bash
npm install @digitalcloud.no/safe-fs-plus
```

**Features:** Safe file operations, directory copying, size calculation, temp directories

[📖 Documentation](./packages/safe-fs-plus/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/safe-fs-plus)

---

### 6. [@digitalcloud.no/cli-pretty-logger](./packages/cli-pretty-logger)

Simple colored logger for CLI applications.

```bash
npm install @digitalcloud.no/cli-pretty-logger
```

**Features:** Colored output, log levels, timestamps, zero dependencies

[📖 Documentation](./packages/cli-pretty-logger/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/cli-pretty-logger)

---

### 7. [@digitalcloud.no/jsonschema-ts-helper](./packages/jsonschema-ts-helper)

Generate TypeScript types from JSON Schema.

```bash
npm install @digitalcloud.no/jsonschema-ts-helper
```

**Features:** JSON Schema to TypeScript, CLI tool, programmatic API

[📖 Documentation](./packages/jsonschema-ts-helper/README.md) | [📦 npm](https://www.npmjs.com/package/@digitalcloud.no/jsonschema-ts-helper)

---

## 🚀 Development

This is a monorepo managed with npm workspaces.

### Install dependencies
```bash
npm install
```

### Build all packages
```bash
npm run build
```

### Test all packages
```bash
npm test
```

### Publish all packages
```bash
npm publish --workspaces
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [digitalcloud.no](https://digitalcloud.no)

## 🔗 Links

- **GitHub:** https://github.com/syedrazaalino/npm-packages
- **npm Organization:** https://www.npmjs.com/org/digitalcloud.no
- **Report Issues:** https://github.com/syedrazaalino/npm-packages/issues
