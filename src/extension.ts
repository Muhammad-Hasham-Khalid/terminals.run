import { ExtensionContext, commands } from "vscode";
import { runTerminalsCommand } from "./commands/run-terminals-cmd";
import { stopTerminalsCommand } from "./commands/stop-terminals-cmd";

export function activate(context: ExtensionContext) {
  let disposables = [
    commands.registerCommand(
      "terminals-run.runTerminals",
      runTerminalsCommand(context)
    ),
    commands.registerCommand(
      "terminals-run.stopTerminals",
      stopTerminalsCommand(context)
    ),
  ];

  context.subscriptions.push(...disposables);
}

export function deactivate() {}
