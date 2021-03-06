// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getLastNoneEmpty } from './utils/common';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "logger" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('logger.log', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const positions = editor.selections.sort((a, b) => a.active.line - b.active.line);
		const lastNoneEmptyLine = getLastNoneEmpty(positions, editor);

		if (positions.length > 1 && lastNoneEmptyLine) {
			let table: string = '{\n';
			positions.map((position, index) => {
				if (!editor) {
					return position;
				}
				const text = editor.document.getText(position);
				if (typeof text !== 'undefined' && text !== '') {
					const value = `typeof ${text} === 'object' ? JSON.stringify(${text}) : ${text}`;
					table += positions.length === index + 1 ? `  ${text}: ${value}\n}` : `  ${text}: ${value},\n`;
				}

				return position;
			});
			editor.insertSnippet(
				new vscode.SnippetString(`console.table(${table});\n\n`), new vscode.Position(lastNoneEmptyLine.active.line + 1, 0)
			);
		} else {
			const text = editor.document.getText(editor.selection);
			if (typeof text !== 'undefined' && text !== '') {
				editor.insertSnippet(new vscode.SnippetString(`console.log('${text}: ', ${text});\n\n`), new vscode.Position(positions[0].active.line + 1, 0));
			} else {
				editor.insertSnippet(new vscode.SnippetString('console.log();\n\n'), new vscode.Position(positions[positions.length - 1].active.line, 0));
			}
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
