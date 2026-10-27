/**
 * Map a Pi-shaped tool event into the generic tool-event schema.
 * Fixture events already near-generic; normalize aliases Pi might emit.
 */
export function mapEvent(ev) {
  return {
    toolName: ev.toolName ?? ev.tool?.name ?? ev.name,
    args: ev.args ?? ev.tool?.arguments ?? ev.input ?? {},
    result: ev.result ?? ev.toolResult ?? ev.output ?? null,
    timestamp: ev.timestamp ?? ev.ts,
    modelId: ev.modelId ?? ev.model,
    id: ev.id ?? ev.eventId,
    argsPreview: ev.argsPreview,
    resultPreview: ev.resultPreview,
    policyBundleHash: ev.policyBundleHash,
  };
}
export default mapEvent;
