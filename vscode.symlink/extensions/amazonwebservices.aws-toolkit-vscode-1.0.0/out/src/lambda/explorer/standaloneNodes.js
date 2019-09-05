/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
const vscode = require("vscode");
const extensionGlobals_1 = require("../../shared/extensionGlobals");
const awsTreeErrorHandlerNode_1 = require("../../shared/treeview/awsTreeErrorHandlerNode");
const collectionUtils_1 = require("../../shared/utilities/collectionUtils");
const utils_1 = require("../utils");
const functionNode_1 = require("./functionNode");
class DefaultStandaloneFunctionGroupNode extends awsTreeErrorHandlerNode_1.AWSTreeErrorHandlerNode {
    constructor(parent, getExtensionAbsolutePath) {
        super('Lambda', vscode.TreeItemCollapsibleState.Collapsed);
        this.parent = parent;
        this.getExtensionAbsolutePath = getExtensionAbsolutePath;
        this.functionNodes = new Map();
    }
    get regionCode() {
        return this.parent.regionCode;
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleErrorProneOperation(() => __awaiter(this, void 0, void 0, function* () { return this.updateChildren(); }), localize('AWS.explorerNode.lambda.error', 'Error loading Lambda resources'));
            return !!this.errorNode ? [this.errorNode]
                : [...this.functionNodes.values()]
                    .sort((nodeA, nodeB) => nodeA.functionName.localeCompare(nodeB.functionName));
        });
    }
    updateChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = extensionGlobals_1.ext.toolkitClientBuilder.createLambdaClient(this.regionCode);
            const functions = collectionUtils_1.toMap(yield collectionUtils_1.toArrayAsync(utils_1.listLambdaFunctions(client)), configuration => configuration.FunctionName);
            collectionUtils_1.updateInPlace(this.functionNodes, functions.keys(), key => this.functionNodes.get(key).update(functions.get(key)), key => new DefaultStandaloneFunctionNode(this, functions.get(key), relativeExtensionPath => this.getExtensionAbsolutePath(relativeExtensionPath)));
        });
    }
}
exports.DefaultStandaloneFunctionGroupNode = DefaultStandaloneFunctionGroupNode;
class DefaultStandaloneFunctionNode extends functionNode_1.FunctionNodeBase {
    constructor(parent, configuration, getExtensionAbsolutePath) {
        super(configuration, getExtensionAbsolutePath);
        this.parent = parent;
        this.contextValue = 'awsRegionFunctionNode';
    }
    get regionCode() {
        return this.parent.regionCode;
    }
}
exports.DefaultStandaloneFunctionNode = DefaultStandaloneFunctionNode;
//# sourceMappingURL=standaloneNodes.js.map