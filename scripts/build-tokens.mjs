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

const breakpointMappingFile = path.join(
  repoRoot,
  "tokens/figma/breakpoint-mapping.json"
);

const rawOutputFile = path.join(outputFolder, "tokens.raw.json");
const studioOutputFile = path.join(outputFolder, "tokens.studio.json");

const tokenStudioSetName = "global";

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Failed to read or parse JSON file: ${filePath}\n${error.message}`
    );
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

/**
 * Return the value at a dot-separated object path.
 *
 * Example:
 * getValueAtPath(tokens, "typography.heading.h1.base")
 */
function getValueAtPath(root, pathValue) {
  const segments = Array.isArray(pathValue)
    ? pathValue
    : pathValue.split(".");

  let current = root;

  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) {
      return undefined;
    }

    if (!Object.prototype.hasOwnProperty.call(current, segment)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

/**
 * Find the owning DTCG token for a mapping source.
 *
 * Examples:
 *
 * typography.heading.h1.base.$value.fontSize
 * becomes:
 * typography.heading.h1.base
 *
 * layout.page.padding.base
 * remains:
 * layout.page.padding.base
 */
function findOwningTokenPath(root, sourcePath) {
  const segments = sourcePath.split(".");

  if (getValueAtPath(root, segments) === undefined) {
    throw new Error(
      `Breakpoint mapping source does not exist in compiled tokens: ${sourcePath}`
    );
  }

  for (let end = segments.length; end > 0; end -= 1) {
    const candidateSegments = segments.slice(0, end);
    const candidate = getValueAtPath(root, candidateSegments);

    if (
      isObject(candidate) &&
      Object.prototype.hasOwnProperty.call(candidate, "$value")
    ) {
      return candidateSegments.join(".");
    }
  }

  throw new Error(
    `Could not find the owning DTCG token for mapping source: ${sourcePath}`
  );
}

/**
 * Derive the exact responsive token nodes that must not be included in the
 * Tokens Studio-facing output.
 *
 * The list is derived only from each mapping mode's "source" property.
 *
 * It does not use:
 * - semanticSource
 * - resolvedSource
 * - fontSizeSource
 * - requiresGitHubUpdate
 */
function deriveModeManagedTokenPaths(mapping, compiledTokens) {
  if (!Array.isArray(mapping.modes) || mapping.modes.length === 0) {
    throw new Error(
      "tokens/figma/breakpoint-mapping.json must define a non-empty modes array."
    );
  }

  if (!Array.isArray(mapping.variables)) {
    throw new Error(
      "tokens/figma/breakpoint-mapping.json must define a variables array."
    );
  }

  const allowedModes = new Set(mapping.modes);
  const excludedPaths = new Set();

  for (const variable of mapping.variables) {
    if (!isObject(variable.modes)) {
      throw new Error(
        `Breakpoint mapping variable has no modes object: ${
          variable.figmaVariable ?? "unknown variable"
        }`
      );
    }

    /*
     * Every mapped Figma variable should have all Breakpoint modes.
     */
    for (const expectedMode of allowedModes) {
      if (
        !Object.prototype.hasOwnProperty.call(
          variable.modes,
          expectedMode
        )
      ) {
        throw new Error(
          `Breakpoint mapping variable ${
            variable.figmaVariable ?? "unknown variable"
          } is missing mode: ${expectedMode}`
        );
      }
    }

    for (const [modeName, modeConfig] of Object.entries(variable.modes)) {
      if (!allowedModes.has(modeName)) {
        throw new Error(
          `Unexpected mode "${modeName}" in breakpoint mapping variable: ${
            variable.figmaVariable ?? "unknown variable"
          }`
        );
      }

      if (
        !isObject(modeConfig) ||
        typeof modeConfig.source !== "string"
      ) {
        throw new Error(
          `Breakpoint mapping variable ${
            variable.figmaVariable ?? "unknown variable"
          }, mode ${modeName}, has no valid source path.`
        );
      }

      const owningTokenPath = findOwningTokenPath(
        compiledTokens,
        modeConfig.source
      );

      const owningSegments = owningTokenPath.split(".");
      const owningMode = owningSegments[owningSegments.length - 1];

      /*
       * Prevent the script from deleting an unexpected parent token.
       */
      if (owningMode !== modeName) {
        throw new Error(
          [
            "Mapping source resolved to an unexpected token boundary.",
            `Figma variable: ${
              variable.figmaVariable ?? "unknown variable"
            }`,
            `Mode: ${modeName}`,
            `Source: ${modeConfig.source}`,
            `Owning token: ${owningTokenPath}`
          ].join("\n")
        );
      }

      /*
       * Confirm that the owning responsive group contains all three modes.
       */
      const responsiveGroupPath = owningSegments.slice(0, -1);
      const responsiveGroup = getValueAtPath(
        compiledTokens,
        responsiveGroupPath
      );

      for (const expectedMode of allowedModes) {
        if (
          !isObject(responsiveGroup) ||
          !Object.prototype.hasOwnProperty.call(
            responsiveGroup,
            expectedMode
          )
        ) {
          throw new Error(
            `Responsive token group ${responsiveGroupPath.join(
              "."
            )} is missing mode: ${expectedMode}`
          );
        }
      }

      /*
       * A Set prevents duplicate exclusions.
       *
       * For example, H4 font size and H4 line height both point into the
       * same composite typography token.
       */
      excludedPaths.add(owningTokenPath);
    }
  }

  return [...excludedPaths].sort();
}

/**
 * Delete one exact dot-separated path from an object.
 */
function deletePath(root, tokenPath) {
  const segments = tokenPath.split(".");
  let current = root;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];

    if (!isObject(current[segment])) {
      throw new Error(`Cannot delete missing token path: ${tokenPath}`);
    }

    current = current[segment];
  }

  const finalSegment = segments[segments.length - 1];

  if (!Object.prototype.hasOwnProperty.call(current, finalSegment)) {
    throw new Error(`Cannot delete missing token path: ${tokenPath}`);
  }

  delete current[finalSegment];
}

/**
 * Remove empty groups and groups that contain only metadata.
 *
 * For example, after base, md and lg are removed, this:
 *
 * {
 *   "$description": "Heading typography"
 * }
 *
 * should not remain in tokens.studio.json.
 */
function pruneMetadataOnlyGroups(root) {
  function shouldPrune(node) {
    if (!isObject(node)) {
      return false;
    }

    /*
     * A real token must always be retained, including composite tokens whose
     * $value is itself an object.
     */
    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      return false;
    }

    for (const key of Object.keys(node)) {
      if (key.startsWith("$")) {
        continue;
      }

      if (isObject(node[key]) && shouldPrune(node[key])) {
        delete node[key];
      }
    }

    /*
     * Remove a group when nothing remains except keys such as:
     * $description, $type, $extensions or $deprecated.
     */
    return Object.keys(node).every((key) => key.startsWith("$"));
  }

  for (const key of Object.keys(root)) {
    if (isObject(root[key]) && shouldPrune(root[key])) {
      delete root[key];
    }
  }
}

/**
 * Check that every alias retained in tokens.studio.json still points to
 * another retained token.
 *
 * This prevents the filter from leaving something like:
 *
 * form.helper.foo -> typography.body.small.base
 *
 * after typography.body.small.base has been removed.
 */
function validateRetainedAliases(tokens) {
  const brokenAliases = [];
  let checkedAliasCount = 0;

  function inspectValue(value, owningTokenPath) {
    if (typeof value === "string") {
      for (const match of value.matchAll(/\{([^{}]+)\}/g)) {
        const aliasPath = match[1];
        checkedAliasCount += 1;

        if (getValueAtPath(tokens, aliasPath) === undefined) {
          brokenAliases.push({
            owningTokenPath,
            aliasPath
          });
        }
      }

      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        inspectValue(item, owningTokenPath);
      }

      return;
    }

    if (isObject(value)) {
      for (const childValue of Object.values(value)) {
        inspectValue(childValue, owningTokenPath);
      }
    }
  }

  function walk(node, currentPath = []) {
    if (!isObject(node)) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      inspectValue(node.$value, currentPath.join("."));
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$")) {
        walk(child, [...currentPath, key]);
      }
    }
  }

  walk(tokens);

  if (brokenAliases.length > 0) {
    const details = brokenAliases
      .map(
        ({ owningTokenPath, aliasPath }) =>
          `- ${owningTokenPath} references missing token ${aliasPath}`
      )
      .join("\n");

    throw new Error(
      `Filtered Tokens Studio output contains broken aliases:\n${details}`
    );
  }

  return checkedAliasCount;
}

/**
 * Collect all actual DTCG token paths.
 *
 * Groups and metadata are not counted as tokens.
 */
function collectTokenPaths(root) {
  const tokenPaths = [];

  function walk(node, currentPath = []) {
    if (!isObject(node)) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      tokenPaths.push(currentPath.join("."));
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$")) {
        walk(child, [...currentPath, key]);
      }
    }
  }

  walk(root);

  return tokenPaths.sort();
}

function buildTokens() {
  let compiledTokens = {};

  /*
   * Build the complete canonical token tree exactly as before.
   */
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

  /*
   * tokens.raw.json remains complete.
   *
   * All base, md and lg branches remain present for development,
   * documentation, source control and AI interpretation.
   */
  writeJson(rawOutputFile, compiledTokens);

  /*
   * Start the Tokens Studio output as a clone of the full canonical tree.
   */
  const studioTokens = structuredClone(compiledTokens);
  const breakpointMapping = readJsonFile(breakpointMappingFile);

  /*
   * Derive the exact token nodes already represented by Figma modes.
   */
  const excludedTokenPaths = deriveModeManagedTokenPaths(
    breakpointMapping,
    compiledTokens
  );

  /*
   * Remove those tokens only from the Tokens Studio-facing copy.
   */
  for (const tokenPath of excludedTokenPaths) {
    deletePath(studioTokens, tokenPath);
  }

  /*
   * Remove parent objects left empty after responsive tokens were removed.
   */
  pruneMetadataOnlyGroups(studioTokens);

  /*
   * Confirm that every intended exclusion was actually removed.
   */
  for (const tokenPath of excludedTokenPaths) {
    if (getValueAtPath(studioTokens, tokenPath) !== undefined) {
      throw new Error(
        `Mode-managed token was not removed from Tokens Studio output: ${tokenPath}`
      );
    }
  }

  /*
   * Stop the build if a retained token points at an excluded token.
   */
  const checkedAliasCount = validateRetainedAliases(studioTokens);

  const rawTokenPaths = collectTokenPaths(compiledTokens);
  const studioTokenPaths = collectTokenPaths(studioTokens);

  const removedTokenCount =
    rawTokenPaths.length - studioTokenPaths.length;

  /*
   * Each derived exclusion should correspond to exactly one DTCG token.
   */
  if (removedTokenCount !== excludedTokenPaths.length) {
    throw new Error(
      [
        "Unexpected Tokens Studio token-count difference.",
        `Derived exclusions: ${excludedTokenPaths.length}`,
        `Actual removed tokens: ${removedTokenCount}`
      ].join("\n")
    );
  }

  /*
   * Keep the existing single global Tokens Studio set.
   */
  writeJson(studioOutputFile, {
    [tokenStudioSetName]: studioTokens
  });

  console.log(
    `\nRaw compiled tokens written to: ${path.relative(
      repoRoot,
      rawOutputFile
    )}`
  );

  console.log(
    `Tokens Studio compiled file written to: ${path.relative(
      repoRoot,
      studioOutputFile
    )}`
  );

  console.log(`\nRaw token count: ${rawTokenPaths.length}`);
  console.log(
    `Tokens Studio token count: ${studioTokenPaths.length}`
  );

  console.log(
    `Mode-managed token nodes excluded from Tokens Studio: ${excludedTokenPaths.length}`
  );

  console.log(`Retained aliases checked: ${checkedAliasCount}`);
  console.log("Broken retained aliases: 0");

  console.log("\nExcluded mode-managed token paths:");

  for (const tokenPath of excludedTokenPaths) {
    console.log(`- ${tokenPath}`);
  }
}

buildTokens();