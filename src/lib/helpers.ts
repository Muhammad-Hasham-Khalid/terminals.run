import { ExtensionContext } from "vscode";

export function useStateManager(context: ExtensionContext) {
  function read(key: string) {
    return context.workspaceState.get(key);
  }

  function write(key: string, value: any) {
    return context.workspaceState.update(key, value);
  }

  return { read, write };
}
