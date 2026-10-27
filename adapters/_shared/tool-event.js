/**
 * Minimal tool-event schema — the only contract any agent needs.
 *
 * One event object:
 * {
 *   "toolName": string,          // required
 *   "args": any,                 // required (object/array/primitive; digested)
 *   "result": any,               // required
 *   "timestamp": string?,        // ISO-8601; optional
 *   "modelId": string?,          // optional
 *   "id": string?,               // optional stable id
 *   "policyBundleHash": string?, // optional
 *   "argsPreview": object?,      // optional human preview
 *   "resultPreview": object?     // optional human preview
 * }
 *
 * File formats accepted by replay:
 * - JSON array of events
 * - { "events": [ ... ], "modelId"?: string, "policyBundleHash"?: string }
 * - JSON Lines (one event object per line)
 */

/**
 * @param {unknown} raw
 * @returns {{ events: object[], defaults: { modelId?: string, policyBundleHash?: string } }}
 */
export function parseToolEventFile(raw) {
  if (typeof raw !== 'string') {
    throw new TypeError('tool-event file must be a string');
  }
  const text = raw.replace(/^\uFEFF/, '').trim();
  if (!text) return { events: [], defaults: {} };

  // JSON Lines if multiple non-empty lines and first line is object-ish
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const looksLikeJsonl =
    lines.length > 1 &&
    lines.every((l) => l.startsWith('{')) &&
    !text.trimStart().startsWith('[');

  if (looksLikeJsonl) {
    const events = lines.map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`JSONL parse error on line ${i + 1}: ${err.message}`);
      }
    });
    return { events, defaults: {} };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`JSON parse error: ${err.message}`);
  }

  if (Array.isArray(parsed)) {
    return { events: parsed, defaults: {} };
  }
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.events)) {
    const { events, modelId, policyBundleHash, ...rest } = parsed;
    return {
      events,
      defaults: {
        ...(modelId !== undefined ? { modelId } : {}),
        ...(policyBundleHash !== undefined ? { policyBundleHash } : {}),
        ...rest,
      },
    };
  }
  throw new Error(
    'Expected JSON array, { events: [...] }, or JSON Lines of tool-event objects',
  );
}

/**
 * Normalize a single event into emitReceipt fields.
 * Harness-specific mappers should call this after shaping into the generic schema.
 *
 * @param {object} event
 * @param {object} [defaults]
 */
export function normalizeToolEvent(event, defaults = {}) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    throw new TypeError('tool event must be an object');
  }
  const toolName = event.toolName ?? event.tool_name ?? event.name;
  if (!toolName || typeof toolName !== 'string') {
    throw new TypeError('tool event missing toolName');
  }
  if (!('args' in event)) {
    throw new TypeError(`tool event ${toolName}: missing args`);
  }
  if (!('result' in event)) {
    throw new TypeError(`tool event ${toolName}: missing result`);
  }

  return {
    toolName,
    args: event.args,
    result: event.result,
    modelId: event.modelId ?? event.model_id ?? defaults.modelId,
    policyBundleHash: event.policyBundleHash ?? defaults.policyBundleHash,
    id: event.id,
    timestamp: event.timestamp ?? event.ts,
    argsPreview: event.argsPreview,
    resultPreview: event.resultPreview,
  };
}
