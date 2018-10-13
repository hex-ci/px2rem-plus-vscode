import { CompletionItemKind, Range, Position } from 'vscode';
import helpers from './helpers';

const pxReg = /^[+-]?([0-9]*[.])?[0-9]+(p|px|$)$/;
const remReg = /^[+-]?([0-9]*[.])?[0-9]+(r|re|rem|$)$/;

export default class Provider {
  constructor() {
  }

  provideCompletionItems(document, position) {
    const prefix = this.getPrefix(document, position);

    if (pxReg.test(prefix)) {
      if (helpers.isUseVwVh) {
        return this.getConvertCompletionForVwVh(prefix);
      }
      else {
        return this.getConvertCompletion(prefix);
      }
    }
    else if (helpers.isTwoWay && remReg.test(prefix)) {
      return this.getConvertCompletion(prefix, true);
    }
  }

  getConvertCompletion(prefix, isRem2Px) {
    const str = isRem2Px ? helpers.getPx(prefix) : helpers.getRem(prefix);

    if (str !== false) {
      const base = helpers.base;

      const num = parseFloat(prefix);

      return [{
        label : str,
        insertText: str,
        kind: CompletionItemKind.Unit,
        detail: helpers.localize('provider.base') + base,
        filterText: `${num}` + (isRem2Px ? 'rem' : 'px'),
        preselect: true
      }];
    }
  }

  getConvertCompletionForVwVh(prefix) {
    const strVw = helpers.getRem(prefix, 'vw');
    const strVh = helpers.getRem(prefix, 'vh');

    if (strVw !== false) {
      const base = helpers.base;

      const num = parseFloat(prefix);

      return [
        {
          label : strVw,
          insertText: strVw,
          kind: CompletionItemKind.Unit,
          detail: helpers.localize('provider.base') + base,
          filterText: `${num}px`,
          sortText: '0',
          preselect: true
        },
        {
          label : strVh,
          insertText: strVh,
          kind: CompletionItemKind.Unit,
          detail: helpers.localize('provider.base') + base,
          filterText: `${num}px`,
          sortText: '1',
          preselect: false
        }
      ];
    }
  }

  getPrefix(document, position) {
    const regex = /[+-]?[\w\d.]+$/;
    const line = document.getText(new Range(new Position(position.line, 0), position));

    const match = line.match(regex);

    return match ? match[0] : '';
  }
}
