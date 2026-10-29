// A small MCP server over stdio, in plain readable code with no dependencies, so the plugin runs straight from
// source with `node` and no npm install. It speaks JSON-RPC 2.0, one message per line, and implements only what
// this plugin needs: initialize, ping, tools/list and tools/call. Notifications (no id) are accepted and ignored.
import readline from "node:readline";

const SUPPORTED_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

/** Checks `args` against a flat JSON schema ({ type: "object", properties, required }) of the kind used here:
 *  strings (minLength, enum) and arrays of strings. Returns { args } with unknown keys dropped, or { error }. */
export function checkArgs(schema, args) {
  if (args == null) args = {};
  if (typeof args !== "object" || Array.isArray(args)) return { error: "arguments must be an object" };
  const out = {};
  for (const key of schema.required ?? []) if (args[key] === undefined) return { error: `missing ${key}` };
  for (const [key, rule] of Object.entries(schema.properties ?? {})) {
    const v = args[key];
    if (v === undefined) continue;
    if (rule.type === "string") {
      if (typeof v !== "string") return { error: `${key} must be a string` };
      if (rule.minLength && v.length < rule.minLength) return { error: `${key} is too short` };
      if (rule.enum && !rule.enum.includes(v)) return { error: `${key} must be one of ${rule.enum.join(", ")}` };
    } else if (rule.type === "array") {
      if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) return { error: `${key} must be a list of strings` };
    }
    out[key] = v;
  }
  return { args: out };
}

export class StdioMcpServer {
  constructor(info, { instructions } = {}) {
    this.info = info;
    this.instructions = instructions;
    this.tools = new Map();
  }

  /** Registers a tool. `inputSchema` is a JSON schema; `handler(args)` returns an MCP tool result. */
  tool(name, description, inputSchema, handler) {
    this.tools.set(name, { name, description, inputSchema: { type: "object", additionalProperties: false, ...inputSchema }, handler });
  }

  async handle(msg) {
    const { method, params = {} } = msg;
    if (method === "initialize") {
      const asked = params.protocolVersion;
      return {
        protocolVersion: SUPPORTED_VERSIONS.includes(asked) ? asked : SUPPORTED_VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: this.info,
        ...(this.instructions ? { instructions: this.instructions } : {}),
      };
    }
    if (method === "ping") return {};
    if (method === "tools/list") {
      return { tools: [...this.tools.values()].map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) };
    }
    if (method === "tools/call") {
      const tool = this.tools.get(params.name);
      if (!tool) throw Object.assign(new Error(`Unknown tool: ${params.name}`), { code: -32602 });
      const checked = checkArgs(tool.inputSchema, params.arguments);
      if (checked.error) return { content: [{ type: "text", text: `Invalid arguments for ${tool.name}: ${checked.error}` }], isError: true };
      return await tool.handler(checked.args);
    }
    throw Object.assign(new Error(`Method not found: ${method}`), { code: -32601 });
  }

  /** Reads requests from stdin and writes responses to stdout; the process ends on its own when stdin closes. */
  connect(input = process.stdin, output = process.stdout) {
    const send = (m) => output.write(JSON.stringify(m) + "\n");
    const lines = readline.createInterface({ input, crlfDelay: Infinity });
    lines.on("line", async (line) => {
      if (!line.trim()) return;
      let msg;
      try { msg = JSON.parse(line); } catch { return send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }); }
      if (msg.id === undefined || msg.id === null) return; // a notification: nothing to answer
      try {
        send({ jsonrpc: "2.0", id: msg.id, result: await this.handle(msg) });
      } catch (err) {
        send({ jsonrpc: "2.0", id: msg.id, error: { code: err.code ?? -32603, message: err.message } });
      }
    });
  }
}
