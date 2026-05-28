import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import validateJson from "../../scripts/validate-json.js";

const execFileAsync = promisify(execFile);
const { findJsonFiles, validateJsonFile } = validateJson;

//Script location relative to this test file
const repoRoot = path.resolve(__dirname, "../..");
const scriptPath = path.join(repoRoot, "scripts", "validate-json.js");

let workspace;

/**
 * Helper to programmatically populate files in our isolated tmp workspace.
 *
 * @param {string} relativePath - Path relative to the temporary workspace
 * @param {string} content - File content to write
 * @returns {Promise<string>} Absolute path to the written file
 */
async function writeFixture(relativePath, content) {
  const filePath = path.join(workspace, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  return filePath;
}

beforeEach(async () => {
  //The acceptance criteria is to secure a completely isolated tmp directory workspace
  workspace = await mkdtemp(path.join(tmpdir(), "memebro-json-test-"));
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(workspace, { recursive: true, force: true });
});

describe("findJsonFiles", () => {
  it("skips paths in node_modules, research/ai-prototypes/outputs, and .git", async () => {
    await writeFixture("node_modules/package.json", "{}");
    await writeFixture("research/ai-prototypes/outputs/bad.json", "{}");
    await writeFixture(".git/config.json", "{}");

    const rootJson = await writeFixture("valid-root.json", "{}");

    const matchedFiles = findJsonFiles(workspace, [
      "node_modules",
      "research/ai-prototypes/outputs",
      ".git",
    ]);

    expect(matchedFiles).toEqual([rootJson]);
  });

  it("finds .json files in nested directories", async () => {
    const nestedJson = await writeFixture("src/components/gallery/data.json", "{}");

    const matchedFiles = findJsonFiles(workspace, []);

    expect(matchedFiles).toEqual([nestedJson]);
  });
});

describe("validateJsonFile", () => {
  it("returns true for valid JSON", async () => {
    const validFile = await writeFixture("good.json", '{"status": "success"}');
    expect(validateJsonFile(validFile)).toBe(true);
  });

  it("returns false and logs the path for invalid JSON", async () => {
    const invalidFile = await writeFixture("bad.json", '{"status": "broken",}');
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(validateJsonFile(invalidFile)).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain(invalidFile);
  });
});

describe("validate-json script execution", () => {
  it("exits non-zero when any file fails validation", async () => {
    await writeFixture("good.json", '{"valid": true}');
    const brokenFile = await writeFixture("nested/folder/broken.json", '{"valid": false, ,}');

    //spawn the actual script runner as a child process against the tmp workspace
    await expect(
      execFileAsync(process.execPath, [scriptPath], { cwd: workspace })
    ).rejects.toMatchObject({
      //confirms the the node bubbles up the status code 1 failure
      code: 1,
      //ensures the error logs explicitly surface the broken file path
      stderr: expect.stringContaining(brokenFile),
    });
  });
});
