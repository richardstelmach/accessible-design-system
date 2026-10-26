/** Project approved web font stacks to installed Figma families for Studio only.
 * Both input tokens and mapping are source-controlled; raw/browser values remain
 * canonical. Validate the whole mapping before changing the Studio clone.
 */
export function projectFigmaFontFamilies(tokens, mapping) {
  if (mapping?.schemaVersion !== 1 || !Array.isArray(mapping.families)) {
    throw new Error('Font-family mapping must have schemaVersion 1 and a families array.');
  }
  const leaves = new Map();
  function walk(node, segments = []) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    if (Object.hasOwn(node, '$value')) {
      if (node.$type === 'fontFamily') leaves.set(segments.join('.'), node);
      return;
    }
    for (const [key, value] of Object.entries(node)) if (!key.startsWith('$')) walk(value, [...segments, key]);
  }
  walk(tokens);
  const updates = new Map();
  for (const family of mapping.families) {
    if (!family || typeof family.source !== 'string' || updates.has(family.source)) {
      throw new Error('Font-family mapping sources must be unique token paths.');
    }
    const token = leaves.get(family.source);
    if (!token || typeof token.$value !== 'string' || !token.$value.includes(',')) {
      throw new Error(`Font-family mapping source must be a literal font stack: ${family.source}`);
    }
    if (token.$value !== family.expectedWebValue) {
      throw new Error(`Font-family mapping is stale for ${family.source}; review the web and Figma choices together.`);
    }
    if (typeof family.figmaValue !== 'string' || !family.figmaValue.trim() || /[,{}]/.test(family.figmaValue)) {
      throw new Error(`Font-family mapping needs one installed Figma family: ${family.source}`);
    }
    if (typeof family.reason !== 'string' || !family.reason.trim()) {
      throw new Error(`Font-family mapping needs a documented reason: ${family.source}`);
    }
    updates.set(family.source, family.figmaValue);
  }
  for (const [name, token] of leaves) {
    if (typeof token.$value === 'string' && token.$value.includes(',') && !updates.has(name)) {
      throw new Error(`Web font stack has no explicit Figma mapping: ${name}`);
    }
  }
  for (const [name, value] of updates) leaves.get(name).$value = value;
  return updates.size;
}
