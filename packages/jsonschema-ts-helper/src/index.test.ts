import { describe, it, expect } from "vitest";
import { generateTypes, JsonSchema } from "./index";

describe("jsonschema-ts-helper", () => {
  it("generates a simple interface from object schema", () => {
    const schema: JsonSchema = {
      type: "object",
      properties: {
        id: { type: "string" },
        age: { type: "number" }
      },
      required: ["id"]
    };

    const code = generateTypes(schema, { rootName: "User" });

    expect(code).toContain("export interface User");
    expect(code).toContain("id: string");
    expect(code).toContain("age?: number");
  });
});
