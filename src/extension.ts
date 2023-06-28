import path = require("node:path");
import fs = require("node:fs");
import { z } from "zod";
import { ExtensionContext, commands, workspace, window } from "vscode";

const terminalConfigSchema = z.object({
  name: z.string(),
  command: z.string(),
});

type TerminalConfig = z.TypeOf<typeof terminalConfigSchema>;

function runTerminalsCommand(context: ExtensionContext) {
  return async function () {
    if (
      !workspace.workspaceFolders ||
      workspace.workspaceFolders.length === 0
    ) {
      return window.showErrorMessage("No folder opened in workspace!");
    }

    const workspaceFolderPath = workspace.workspaceFolders[0].uri.fsPath;
    const terminalsJsonPath = path.join(workspaceFolderPath, "terminals.json");

    const terminalsJson = await fs.promises
      .readFile(terminalsJsonPath, "utf-8")
      .then((data) => JSON.parse(data));

    // create terminals
    for (const [key, terminalConfig] of Object.entries(terminalsJson)) {
      const parsedTerminalConfig = await terminalConfigSchema.parseAsync(
        terminalConfig
      );
      const terminal = window.createTerminal(parsedTerminalConfig.name);
      terminal.sendText(parsedTerminalConfig.command);
      terminal.hide();
    }
  };
}

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "terminals-run.runTerminals",
    runTerminalsCommand(context)
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
