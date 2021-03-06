import * as vscode from 'vscode';

export const getLastNoneEmpty = (positions: vscode.Selection[], editor: vscode.TextEditor) =>
  [...positions]
    .reverse()
    .find(position => !!editor.document.getText(position));
