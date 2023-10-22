import { ExtensionContext, Terminal } from "vscode";
import { useStateManager } from "../lib/helpers";

export function stopTerminalsCommand(context: ExtensionContext) {
  return async function () {
    const stateManager = useStateManager(context);
    const terminals = stateManager.read("terminals.run-terminals");

    if (Array.isArray(terminals) && terminals.length > 0) {
      terminals.forEach((terminal: Terminal) => {
        terminal.dispose();
      });
    }

    stateManager.write("terminals.run-terminals", []);
  };
}
