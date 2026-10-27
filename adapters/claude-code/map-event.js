/** Claude Code tool-use / hook logs → generic. */
export function mapEvent(ev) {
  const use = ev.tool_use ?? ev.toolUse ?? ev;
  return {
    toolName: use.name ?? use.toolName ?? ev.name ?? ev.tool_name,
    args: use.input ?? use.arguments ?? use.args ?? ev.args ?? {},
    result:
      ev.tool_result ??
      ev.toolResult ??
      ev.result ??
      (typeof ev.content === 'string' ? { content: ev.content } : ev.content) ??
      null,
    timestamp: ev.timestamp ?? ev.time,
    modelId: ev.modelId ?? ev.model,
    id: ev.id ?? use.id,
    argsPreview: ev.argsPreview,
    resultPreview: ev.resultPreview,
  };
}
export default mapEvent;
