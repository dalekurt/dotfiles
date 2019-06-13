'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    function getComment(text) {
        let comment = [];
        for (let i = 0; i < text.length; i++) {
            comment.push('#');
        }
        return comment.join('');
    }
    function isBeautifiedComment(text) {
        for (let i = 0; i < text.length; i++) {
            if (text[i] != '#') {
                return false;
            }
        }
        return true;
    }
    let command = vscode.commands.registerCommand('extension.beautifyTerraformComments', () => {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor && activeTextEditor.document.languageId === 'hcl') {
            const { document } = activeTextEditor;
            const edit = new vscode.WorkspaceEdit();
            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i);
                if (line.text.startsWith('#') && !isBeautifiedComment(line.text)) {
                    let prevLine = i > 0 ? document.lineAt(i - 1) : null;
                    let nextLine = i < document.lineCount - 1 ? document.lineAt(i + 1) : null;
                    let prevLineIsComment = prevLine && prevLine.text.startsWith('#');
                    let nextLineIsComment = nextLine && nextLine.text.startsWith('#');
                    let comment = getComment(line.text);
                    if (prevLine && prevLineIsComment && isBeautifiedComment(prevLine.text)) {
                        edit.replace(document.uri, prevLine.range, comment);
                    }
                    else if (!prevLineIsComment) {
                        edit.insert(document.uri, line.range.start, comment + '\n');
                    }
                    if (nextLine && nextLineIsComment && isBeautifiedComment(nextLine.text)) {
                        edit.replace(document.uri, nextLine.range, comment);
                    }
                    else if (!nextLineIsComment) {
                        edit.insert(document.uri, line.range.end, '\n' + comment);
                    }
                }
            }
            return vscode.workspace.applyEdit(edit);
        }
    });
    context.subscriptions.push(command);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map