import { ExtensionContext, Terminal, window, workspace } from "vscode";
import { z } from "zod";
import { useStateManager } from "../lib/helpers";
import { terminalConfigSchema } from "../lib/types";
import path = require("node:path");
import fs = require("node:fs");

export function runTerminalsCommand(context: ExtensionContext) {
  return async function () {
    if (
      !workspace.workspaceFolders ||
      workspace.workspaceFolders.length === 0
    ) {
      return window.showErrorMessage("No folder opened in workspace!");
    }

    const workspaceFolderPath = workspace.workspaceFolders[0].uri.fsPath;
    const terminalsJsonPath = path.join(workspaceFolderPath, "terminals.json");

    if (!fs.existsSync(terminalsJsonPath)) {
      return window.showErrorMessage("terminals.json not found");
    }

    const terminalsJson = await fs.promises
      .readFile(terminalsJsonPath, "utf-8")
      .then((data) => JSON.parse(data));

    const parsedResult = await z
      .record(terminalConfigSchema)
      .spa(terminalsJson);

    if (!parsedResult.success) {
      return window.showErrorMessage("Invalid terminals config");
    }
    const parsedTerminalsJson = parsedResult.data;

    const terminals: Terminal[] = [];
    // create terminals
    for (const terminalConfig of Object.values(parsedTerminalsJson)) {
      const terminal = window.createTerminal({
        name: terminalConfig.name,
        color: terminalConfig.color,
      });
      terminal.sendText(terminalConfig.command);
      terminals.push(terminal);
    }

    if (terminals.length > 0) {
      terminals.at(-1)?.show();
    }

    const stateManager = useStateManager(context);
    stateManager.write("terminals.run-terminals", terminals);
  };
}
