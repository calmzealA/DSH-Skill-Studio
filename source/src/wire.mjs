export const PACKAGE = 'dsh-skill-studio';
export const NS = 'skillStudio';
// Host validates requests again in the manager. This codec only admits bounded,
// JSON-safe data and is also shipped to the browser contribution.
function jsonValue(value, depth = 0) {
  if (depth > 20) throw new Error('REQUEST_TOO_DEEP');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) { if (value.length > 5000) throw new Error('REQUEST_TOO_LARGE'); value.forEach(x => jsonValue(x, depth + 1)); return value; }
  if (typeof value === 'object' && value && Object.getPrototypeOf(value) === Object.prototype) {
    const entries = Object.entries(value);
    if (entries.length > 5000) throw new Error('REQUEST_TOO_LARGE');
    for (const [key, item] of entries) { if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('INVALID_KEY'); jsonValue(item, depth + 1); }
    return value;
  }
  throw new Error('INVALID_JSON');
}
export const codec = (typeSymbol) => ({ mode: 'strict', typeSymbol, create: () => ({ parse: jsonValue }) });
export const descriptor = {
  id: `${PACKAGE}#skillStudio/request`, service: NS, namespace: NS,
  method: 'request', invocation: { kind: 'direct' },
  parameters: [{ name: 'payload', wire: 'payload', source: 'json', codec: codec(`${PACKAGE}#Request`) }],
  result: codec(`${PACKAGE}#Response`),
};
export const manifest = { package: PACKAGE, face: 'host', schemas: [], invocations: [descriptor] };
export const contribution = { package: PACKAGE, descriptors: [descriptor] };
