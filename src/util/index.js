const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');

function getProjectPath(document) {
  const currentPath = document.uri.fsPath;
  const folder = (vscode.workspace.workspaceFolders || []).map(
    item => item.uri.fsPath,
  );

  let projectPath;

  if (currentPath.includes(folder[0])) {
    projectPath = folder[0];
  }

  return projectPath;
}

function findLocalePath(rootPath, folder) {
  let localePath;
  const dir = fs.readdirSync(rootPath);
  dir.forEach(item => {
    if (item.includes('locale')) {
      localePath = path.resolve(rootPath, item, 'index.js');
    } else if (item.includes('src')) {
      const srcPath = path.resolve(rootPath, item);
      localePath = findLocalePath(srcPath);
    }
  });

  return localePath;
}

function provideLocaleCompletion(document, position, token, context) {
  const zhKey = vscode.workspace.getConfiguration().get('localeHelper.zhKey');
  const line = document.lineAt(position);
  const projectPath = getProjectPath(document);
  const localePath = findLocalePath(projectPath);
  const lineText = line.text.substring(0, position.character);
  if (/locale\.$/g.test(lineText)) {
    const localeString = fs.readFileSync(localePath, 'utf8');
    const tree = esprima.parseModule(localeString);
    const localeObj = tree.body[0].declaration.properties.find(item => {
      return item.key.value === zhKey;
    });
    const locales = localeObj.value.properties.map(({ key, value }) => {
      return {
        key: key.name,
        value: value.value,
      };
    });
    return locales.map(({ key, value }) => {
      // vscode.CompletionItemKind 表示提示的类型
      const item = new vscode.CompletionItem(
        key,
        vscode.CompletionItemKind.Field,
      );
      item.detail = value;
      item.documentation = value;
      return item;
    });
  }
}

function resolveCompletionItem(item, token) {
  return null;
}

function convertLocaleKey(text, name, document) {
  const projectPath = getProjectPath(document);
  const localePath = findLocalePath(projectPath);
  const localeString = fs.readFileSync(localePath, 'utf8');
  const zhKey = vscode.workspace.getConfiguration().get('localeHelper.zhKey');
  esprima.parseModule(localeString, {}, (node, meta) => {
    if (node.type === 'Property' && node.key.value === zhKey){
      entries = {
        start: meta.start.offset,
        end: meta.end.offset
      };
      const localeStrArr = localeString.split('\n');
      localeStrArr.splice(meta.end.line - 1, 0, `\t\t${name}: '${text}',`)
      const newLocaleString = localeStrArr.join('\n');
      fs.writeFileSync(localePath, newLocaleString, 'utf8')
    }
  });
}

module.exports = {
  getProjectPath,
  findLocalePath,
  provideLocaleCompletion,
  resolveCompletionItem,
  convertLocaleKey,
};
