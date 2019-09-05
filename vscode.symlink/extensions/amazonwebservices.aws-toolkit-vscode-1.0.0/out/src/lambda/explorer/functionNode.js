/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const vscode_1 = require("vscode");
const awsTreeNodeBase_1 = require("../../shared/treeview/awsTreeNodeBase");
class FunctionNodeBase extends awsTreeNodeBase_1.AWSTreeNodeBase {
    constructor(configuration, getExtensionAbsolutePath) {
        super('');
        this.configuration = configuration;
        this.getExtensionAbsolutePath = getExtensionAbsolutePath;
        this.update(configuration);
        this.iconPath = {
            dark: vscode_1.Uri.file(this.getExtensionAbsolutePath('resources/dark/lambda.svg')),
            light: vscode_1.Uri.file(this.getExtensionAbsolutePath('resources/light/lambda.svg')),
        };
    }
    update(configuration) {
        this.configuration = configuration;
        this.label = this.configuration.FunctionName || '';
        this.tooltip = `${this.configuration.FunctionName}${os.EOL}${this.configuration.FunctionArn}`;
    }
    get functionName() {
        return this.configuration.FunctionName || '';
    }
}
exports.FunctionNodeBase = FunctionNodeBase;
//# sourceMappingURL=functionNode.js.map