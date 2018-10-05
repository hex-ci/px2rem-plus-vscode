'use babel';

const vscode = require('vscode');

// import Provider from './provider.js';
// import helper from './helpers.js';

// const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

class Px2rem {
  activate(context) {

    // const options = vscode.workspace.getConfiguration('px2rem-plus');
    //
    // let provider = new Provider();
    // const languages = ['html', 'vue', 'css', 'less', 'scss', 'sass', 'stylus'];
    //
    // languages.forEach((item) => {
    //   context.subscriptions.push(vscode.languages.registerCompletionItemProvider(item, provider));
    // });

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.px2rem-plus:convert', () => this.convert()));
  }

  deactivate() {
  }

  convert() {
  }
}

export default new Px2rem();
