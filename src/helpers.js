import vscode from 'vscode';

let config = {};

export default {
  context: {},

  getRem(str) {
    const options = vscode.workspace.getConfiguration('px2rem-plus');
    const base = this.base;
    const num = parseFloat(str);

    if (Math.abs(num) <= 1) {
      return false;
    }

    const rem = Number((num / base).toFixed(options.precision));
    let remStr = String(rem);

    if (options.leadingZero === false) {
      if (rem < 1) {
        remStr = remStr.replace(/^([-+])?0+/, '$1');
      }
    }

    return options.comments ? `${remStr}rem /* ${num}/${base} */` : `${remStr}rem`;
  },

  get base() {
    const options = vscode.workspace.getConfiguration('px2rem-plus');
    const editor = vscode.window.activeTextEditor;

    let base = options.base;

    if (editor) {
      const path = editor.document.fileName;

      if (path && config[path] && config[path].base) {
        base = config[path].base;
      }
    }

    return base;
  },

  set base(str) {
    const base = parseFloat(str);
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const path = editor.document.fileName;
      //console.log(path);
      if (path) {
        if (isNaN(base)) {
          delete config[path];
        }
        else {
          config[path] = {
            base: base
          };
        }

        this.context.globalState.update('config', config);
      }
    }
  },

  set config(obj) {
    config = obj || {};
  },

  get config() {
    return config;
  }
};
