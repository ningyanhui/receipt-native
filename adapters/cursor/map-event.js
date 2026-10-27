/** Cursor / Cloud Agent style tool_call records → generic tool-event. */
export function mapEvent(ev) {
  const toolCall = ev.tool_call ?? ev.toolCall ?? ev;
  return {
    toolName:
      toolCall.toolName ??
      toolCall.name ??
      toolCall.function?.name ??
      ev.name,
    args:
      toolCall.args ??
      toolCall.arguments ??
      toolCall.function?.arguments ??
      ev.args ??
      {},
    result: ev.result ?? ev.tool_result ?? ev.output ?? toolCall.result ?? null,
    timestamp: ev.timestamp ?? ev.created_at ?? toolCall.timestamp,
    modelId: ev.modelId ?? ev.model,
    id: ev.id ?? toolCall.id,
    argsPreview: ev.argsPreview,
    resultPreview: ev.resultPreview,
  };
}
export default mapEvent;
