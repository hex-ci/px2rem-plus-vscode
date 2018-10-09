import { window, languages, commands, Position, Range } from 'vscode';
import Provider from './provider';
import helpers from './helpers';

let extensionContext;

const convert = (textEditor) => {
  const doc = textEditor.document;
  let selection = textEditor.selection;

  if (selection.isEmpty) {
    const start = new Position(0, 0);
    const end = new Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
    selection = new Range(start, end);
  }

  const text = doc.getText(selection);

  textEditor.edit(builder => {
    builder.replace(selection, helpers.convert(text));
  });
};

const settings = async (textEditor) => {
	const result = await window.showInputBox({
    value: helpers.base,
    prompt: 'Enter a base pixel size of the current file. Examples: "75"',
		placeHolder: 'Base pixel size',
		validateInput: value => {
			return /[^0-9.]/.test(value) ? 'please input number' : null;
		}
  });

  if (result === undefined) {
    return;
  }

  if (textEditor.document.isUntitled) {
    window.showWarningMessage('The base pixel size of the current file has not been modified!');

    return;
  }

  helpers.base = result;

  extensionContext.globalState.update('config', helpers.config);

  window.showInformationMessage('The base pixel size of the current file is modified successfully.');
};

export function activate(context) {
  extensionContext = context;

  helpers.config = context.globalState.get('config', {});

  const provider = new Provider();

  ['html', 'css', 'less', 'scss', 'sass', 'stylus', 'vue'].forEach((item) => {
    context.subscriptions.push(languages.registerCompletionItemProvider({
      language: item,
      scheme: ''
    }, provider));
  });

  context.subscriptions.push(commands.registerTextEditorCommand('px2rem-plus.convert', convert));
  context.subscriptions.push(commands.registerTextEditorCommand('px2rem-plus.settings', settings));
}
