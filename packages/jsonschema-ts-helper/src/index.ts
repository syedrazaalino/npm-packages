export type JsonSchema = {
  $id?: string;
  title?: string;
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema | JsonSchema[];
  enum?: (string | number | boolean | null)[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  description?: string;
  additionalProperties?: boolean | JsonSchema;
};

export interface GenerateTypesOptions {
  rootName?: string;
}

function schemaType(schema: JsonSchema): string | undefined {
  if (Array.isArray(schema.type)) {
    if (schema.type.length === 1) {
      return schema.type[0];
    }
    return undefined;
  }
  return schema.type;
}

function escapeIdentifier(name: string): string {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    return name;
  }
  return JSON.stringify(name);
}

function typeForSchema(schema: JsonSchema, nameHint: string): string {
  if (schema.enum && schema.enum.length > 0) {
    return schema.enum
      .map((v) =>
        typeof v === "string" ? JSON.stringify(v) : v === null ? "null" : String(v)
      )
      .join(" | ");
  }

  const t = schemaType(schema);

  switch (t) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "array": {
      const itemSchema = Array.isArray(schema.items)
        ? schema.items[0] ?? { type: "any" }
        : schema.items ?? { type: "any" };
      const itemType = typeForSchema(itemSchema, nameHint + "Item");
      return `${itemType}[]`;
    }
    case "object":
      return inlineObjectType(schema);
    default:
      break;
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    return schema.anyOf.map((s, i) => typeForSchema(s, `${nameHint}AnyOf${i}`)).join(" | ");
  }
  if (schema.oneOf && schema.oneOf.length > 0) {
    return schema.oneOf.map((s, i) => typeForSchema(s, `${nameHint}OneOf${i}`)).join(" | ");
  }

  return "any";
}

function inlineObjectType(schema: JsonSchema): string {
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const entries = Object.entries(props).map(([key, value]) => {
    const optional = required.has(key) ? "" : "?";
    const propType = typeForSchema(value, key);
    const escapedKey = escapeIdentifier(key);
    return `${escapedKey}${optional}: ${propType};`;
  });

  return `{ ${entries.join(" ")} }`;
}

export function generateTypes(
  schema: JsonSchema,
  options: GenerateTypesOptions = {}
): string {
  const name = options.rootName || schema.title || "Root";
  const typeName = escapeIdentifier(name);
  const typeBody = typeForSchema(schema, typeName);
  const lines: string[] = [];

  lines.push(`export interface ${typeName} ${typeBody}`);

  return lines.join("\n");
}
