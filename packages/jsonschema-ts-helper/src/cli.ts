#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { generateTypes, JsonSchema } from "./index";

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(
    "Usage: jsonschema-ts <schema.json> [--name TypeName] [--out output.ts]"
  );
}

export function runCli(argv: string[]): void {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  const input = args[0];
  let rootName: string | undefined;
  let outPath: string | undefined;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--name" && i + 1 < args.length) {
      rootName = args[++i];
    } else if (arg === "--out" && i + 1 < args.length) {
      outPath = args[++i];
    }
  }

  const resolvedInput = path.resolve(input);
  const raw = fs.readFileSync(resolvedInput, "utf8");
  const schema = JSON.parse(raw) as JsonSchema;

  const code = generateTypes(schema, { rootName });

  if (outPath) {
    const resolvedOut = path.resolve(outPath);
    fs.writeFileSync(resolvedOut, code, "utf8");
  } else {
    // eslint-disable-next-line no-console
    console.log(code);
  }
}

if (require.main === module) {
  runCli(process.argv);
}
