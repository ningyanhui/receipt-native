/** OpenAI Codex CLI / agent tool events → generic. */
export function mapEvent(ev) {
  return {
    toolName: ev.toolName ?? ev.tool_name ?? ev.type?.replace(/^tool\./, '') ?? ev.name,
    args: ev.args ?? ev.parameters ?? ev.input ?? {},
    result: ev.result ?? ev.output ?? ev.response ?? null,
    timestamp: ev.timestamp ?? ev.time,
    modelId: ev.modelId ?? ev.model,
    id: ev.id ?? ev.call_id,
    argsPreview: ev.argsPreview,
    resultPreview: ev.resultPreview,
  };
}
export default mapEvent;
