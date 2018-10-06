import vscode from 'vscode';

export default class Provider {
  constructor() {
  }

  provideCompletionItems(document, position, token) {
    return new Promise((resolve) => {
      const item = new vscode.CompletionItem(`test`, vscode.CompletionItemKind.Snippet);

      return resolve([item]);
    });
  }
}
