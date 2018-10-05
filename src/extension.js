'use strict';

const vscode = require('vscode');

const Provider = require('./provider.js');
// import helper from './helpers.js';

// const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

const convert = () => {
  console.log('convert');
};

module.exports = {
  activate(context) {
    // const options = vscode.workspace.getConfiguration('px2rem-plus');

    const provider = new Provider();
    const languages = ['html', 'vue', 'css', 'less', 'scss', 'sass', 'stylus'];

    languages.forEach((item) => {
      context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: item, scheme: 'untitled' }, provider));
    });

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.px2rem-plus:convert', convert));
  },

  deactivate() {
  }
};
