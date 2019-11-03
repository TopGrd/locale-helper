// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {
  getProjectPath,
  findLocalePath,
  provideLocaleCompletion,
  resolveCompletionItem,
  convertLocaleKey,
} = require('./src/util');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "locale-helper" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    function() {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World!');
    },
  );

  const convertDisposable = vscode.commands.registerTextEditorCommand(
    'extension.convertLocale',
    async (textEditor, edit) => {
      vscode.window.showInformationMessage('select World!');
      const doc = textEditor.document;
      const selection = textEditor.selection;
      const text = doc.getText(selection);
      const variable = await vscode.window.showInputBox({
        prompt: '请输入变量名',
      });

      convertLocaleKey(text, variable, doc)
    },
  );

//   vscode.languages.registerCompletionItemProvider({
//     language: 'javascriptreact'
//   }, {
//     provideCompletionItems: (document, position) => {
//         return [
//             {
//                 label: 'mySuggestion',
//                 insertText: 'mySuggestion'
//             }
//         ]
//     }
// }, ['.'])

  context.subscriptions.push(convertDisposable);

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'javascriptreact' },
      {
        provideCompletionItems: provideLocaleCompletion,
        resolveCompletionItem,
      },
      '.',
    ),
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
