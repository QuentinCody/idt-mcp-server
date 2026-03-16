import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDir = join(__dirname, "..");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

let total = 0;
let passed = 0;
let failed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  ${GREEN}✓${RESET} ${message}`);
    } else {
        failed++;
        console.log(`  ${RED}✗${RESET} ${message}`);
    }
}

function readSrc(relPath) {
    return readFileSync(join(serverDir, relPath), "utf-8");
}

console.log(`\n${BLUE}IDT MCP Server — Structured Content Regression${RESET}\n`);

const codonOpt = readSrc("src/tools/codon-optimize.ts");
assert(codonOpt.includes("createCodeModeResponse"), "codon-optimize.ts includes createCodeModeResponse");
assert(codonOpt.includes("createCodeModeError"), "codon-optimize.ts includes createCodeModeError");

const complexity = readSrc("src/tools/complexity-check.ts");
assert(complexity.includes("createCodeModeResponse"), "complexity-check.ts includes createCodeModeResponse");
assert(complexity.includes("createCodeModeError"), "complexity-check.ts includes createCodeModeError");

const index = readSrc("src/index.ts");
assert(index.includes("IdtDataDO"), "index.ts exports IdtDataDO");
assert(index.includes("McpAgent"), "index.ts uses McpAgent");

console.log(`\n  Total: ${total} | ${GREEN}Passed: ${passed}${RESET} | ${failed > 0 ? RED : ""}Failed: ${failed}${RESET}\n`);

if (failed > 0) process.exit(1);
