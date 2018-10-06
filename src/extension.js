import vscode from 'vscode';

import Provider from './provider';
import helpers from './helpers';

// const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

const convert = () => {
  console.log('convert');
};

const settings = async () => {
	const result = await vscode.window.showInputBox({
    value: helpers.base,
    prompt: 'Enter a base pixel size of the current file. Examples: "75"',
		placeHolder: 'Base pixel size',
		validateInput: value => {
			return /[^0-9.]/.test(value) ? 'please input number' : null;
		}
  });

  if (result !== undefined) {
    helpers.base = result;

    vscode.window.showInformationMessage('The base pixel size of the current file is modified successfully.');
  }
};

export function activate(context) {
  // const options = vscode.workspace.getConfiguration('px2rem-plus');
  helpers.context = context;

  helpers.config = context.globalState.get('config', {});

  const provider = new Provider();
  const languages = ['html', 'vue', 'css', 'less', 'scss', 'sass', 'stylus'];

  languages.forEach((item) => {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: item, scheme: 'untitled' }, provider));
  });

  context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.px2rem-plus:convert', convert));

  context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.px2rem-plus:settings', settings));
}
