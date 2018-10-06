import vscode from 'vscode';
import helpers from './helpers';

const pxReg = /^[+-]?([0-9]*[.])?[0-9]+(p|px)$/;

export default class Provider {
  constructor() {
  }

  provideCompletionItems(document, position) {
    const prefix = this.getPrefix(document, position);

    if (pxReg.test(prefix)) {
      return this.getConvertCompletion(prefix);
    }
  }

  getConvertCompletion(prefix, isRem2Px) {
    const str = isRem2Px ? helpers.getPx(prefix) : helpers.getRem(prefix);

    if (str !== false) {
      const base = helpers.base;

      const num = parseFloat(prefix);

      const item = new vscode.CompletionItem(str, vscode.CompletionItemKind.Unit);
      item.insertText = str;
      item.detail = `base: ${base}`;
      item.filterText = `${num}px`;

      return [item];
    }
  }

  getPrefix(document, position) {
    const regex = /[+-]?[\w\d.]+$/;
    const line = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
    // console.log(line);
    const match = line.match(regex);

    return match ? match[0] : '';
  }
}
