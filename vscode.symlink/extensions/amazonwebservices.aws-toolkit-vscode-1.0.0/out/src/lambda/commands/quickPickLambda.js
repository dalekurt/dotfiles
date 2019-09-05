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
const functionNode_1 = require("../explorer/functionNode");
class QuickPickLambda extends functionNode_1.FunctionNodeBase {
    constructor(configuration, regionCode) {
        super(configuration, 
        // TODO : This class is ultimately used by selectLambdaNode, which is no longer
        // required, because the commands that use it no longer use optional params.
        // Phase out.
        (relativeExtensionPath) => '');
        this.regionCode = regionCode;
    }
    get label() {
        return super.label;
    }
}
function quickPickLambda(lambdas, region) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!lambdas || lambdas.length === 0) {
                vscode.window.showInformationMessage(localize('AWS.explorerNode.lambda.noFunctions', '[no functions in this region]'));
            }
            else {
                const qpLambdas = lambdas.map(lambda => new QuickPickLambda(lambda, region));
                return yield vscode.window.showQuickPick(qpLambdas, { placeHolder: 'Choose a lambda' });
            }
            throw new Error('No lambdas to work with.');
        }
        catch (error) {
            vscode.window.showErrorMessage('Unable to connect to AWS.');
        }
    });
}
exports.quickPickLambda = quickPickLambda;
//# sourceMappingURL=quickPickLambda.js.map