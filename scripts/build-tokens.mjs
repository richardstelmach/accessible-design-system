import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const sourceFolders = [
  "tokens/primitives",
  "tokens/semantic",
  "tokens/components",
  "tokens/themes"
];

const outputFolder = path.join(repoRoot, "tokens/compiled");

const rawOutputFile = path.join(outputFolder, "tokens.raw.json");
const studioOutputFile = path.join(outputFolder, "tokens.studio.json");

const tokenStudioSetName = "global";

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to read or parse JSON file: ${filePath}\n${error.message}`);
  }
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(target[key])) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

function getJsonFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => path.join(folderPath, file));
}

function writeJson(filePath, data) {
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8"
  );
}

function buildTokens() {
  let compiledTokens = {};

  for (const folder of sourceFolders) {
    const folderPath = path.join(repoRoot, folder);
    const files = getJsonFiles(folderPath);

    for (const file of files) {
      const json = readJsonFile(file);
      compiledTokens = deepMerge(compiledTokens, json);
      console.log(`Merged: ${path.relative(repoRoot, file)}`);
    }
  }

  fs.mkdirSync(outputFolder, { recursive: true });

  writeJson(rawOutputFile, compiledTokens);

  writeJson(studioOutputFile, {
    [tokenStudioSetName]: compiledTokens
  });

  console.log(`\nRaw compiled tokens written to: ${path.relative(repoRoot, rawOutputFile)}`);
  console.log(`Tokens Studio compiled file written to: ${path.relative(repoRoot, studioOutputFile)}`);
}

buildTokens();