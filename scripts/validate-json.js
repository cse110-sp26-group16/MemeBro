/**
 * JSON validation script.
 * Validates all JSON files in the repository for proper syntax and formatting.
 * Ignores directories: node_modules/, research/ai-prototypes/outputs/, .github/
 */

const fs = require("fs");
const path = require("path");

/**
 * Recursively find all JSON files in a directory.
 *
 * @param {string} dir - Directory path to search
 * @param {string[]} ignorePatterns - Patterns to ignore
 * @returns {string[]} Array of JSON file paths
 */
function findJsonFiles(dir, ignorePatterns = []) {
  const files = [];

  /**
   * Recursively walks through the directory structure starting from the given path, collecting paths of JSON files while skipping any paths that match the specified ignore patterns.
   * @param {string} currentPath - The current directory path being traversed in the recursive walk
   */
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const relativePath = path.relative(process.cwd(), fullPath);

      // Check if path should be ignored
      if (ignorePatterns.some((pattern) => relativePath.includes(pattern))) {
        continue;
      }

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith(".json")) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Validate JSON file syntax.
 *
 * @param {string} filePath - Path to JSON file
 * @returns {boolean} True if valid, false otherwise
 * @throws {SyntaxError} If JSON is invalid, with details about the error
 */
function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    JSON.parse(content);
    return true;
  } catch (error) {
    console.error(`✗ ${filePath}: ${error.message}`);
    return false;
  }
}

// Ignore patterns
const ignorePatterns = ["node_modules", "research/ai-prototypes/outputs", ".git"];

// Find all JSON files
const jsonFiles = findJsonFiles(process.cwd(), ignorePatterns);

if (jsonFiles.length === 0) {
  console.log("No JSON files found.");
  process.exit(0);
}

console.log(`Validating ${jsonFiles.length} JSON file(s)...\n`);

let failCount = 0;

for (const file of jsonFiles) {
  const isValid = validateJsonFile(file);
  if (isValid) {
    console.log(`✓ ${file}`);
  } else {
    failCount++;
  }
}

console.log(`\n${jsonFiles.length - failCount}/${jsonFiles.length} files valid.`);

if (failCount > 0) {
  process.exit(1);
}
