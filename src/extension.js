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
    prompt: helpers.localize('settings.input.prompt'),
		placeHolder: helpers.localize('settings.input.placeHolder'),
		validateInput: value => {
			return /[^0-9.]/.test(value) ? helpers.localize('settings.input.validate') : null;
		}
  });

  if (result === undefined) {
    return;
  }

  if (textEditor.document.isUntitled) {
    window.showWarningMessage(helpers.localize('settings.input.error'));

    return;
  }

  helpers.base = result;

  extensionContext.globalState.update('config', helpers.config);

  window.showInformationMessage(helpers.localize('settings.input.success'));
};

export function activate(context) {
  extensionContext = context;

  helpers.initLocalization(context.extensionPath);
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
