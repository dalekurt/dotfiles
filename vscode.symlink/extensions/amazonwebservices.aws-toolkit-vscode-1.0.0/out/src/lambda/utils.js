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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
const vscode = require("vscode");
const extensionGlobals_1 = require("../shared/extensionGlobals");
const logger_1 = require("../shared/logger");
const collectionUtils_1 = require("../shared/utilities/collectionUtils");
const quickPickLambda_1 = require("./commands/quickPickLambda");
function selectLambdaNode(awsContext, element) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = logger_1.getLogger();
        if (element && element.configuration) {
            logger.info('returning preselected node...');
            return element;
        }
        logger.info('prompting for lambda selection...');
        // TODO: we need to change this into a multi-step command to first obtain the region,
        // then query the lambdas in the region
        const regions = yield awsContext.getExplorerRegions();
        if (regions.length === 0) {
            throw new Error('No regions defined for explorer, required until we have a multi-stage picker');
        }
        const client = extensionGlobals_1.ext.toolkitClientBuilder.createLambdaClient(regions[0]);
        const lambdas = yield collectionUtils_1.toArrayAsync(listLambdaFunctions(client));
        // used to show a list of lambdas and allow user to select.
        // this is useful for calling commands from the command palette
        const selection = yield quickPickLambda_1.quickPickLambda(lambdas, regions[0]);
        if (selection && selection.configuration) {
            return selection;
        }
        throw new Error('No lambda found.');
    });
}
exports.selectLambdaNode = selectLambdaNode;
function listCloudFormationStacks(client) {
    return __asyncGenerator(this, arguments, function* listCloudFormationStacks_1() {
        // TODO: this 'loading' message needs to go under each regional entry
        // in the explorer, and be removed when that region's query completes
        const status = vscode.window.setStatusBarMessage(localize('AWS.message.statusBar.loading.cloudFormation', 'Loading CloudFormation Stacks...'));
        try {
            yield __await(yield* __asyncDelegator(__asyncValues(client.listStacks())));
        }
        finally {
            status.dispose();
        }
    });
}
exports.listCloudFormationStacks = listCloudFormationStacks;
function listLambdaFunctions(client) {
    return __asyncGenerator(this, arguments, function* listLambdaFunctions_1() {
        const status = vscode.window.setStatusBarMessage(localize('AWS.message.statusBar.loading.lambda', 'Loading Lambdas...'));
        try {
            yield __await(yield* __asyncDelegator(__asyncValues(client.listFunctions())));
        }
        finally {
            if (!!status) {
                status.dispose();
            }
        }
    });
}
exports.listLambdaFunctions = listLambdaFunctions;
//# sourceMappingURL=utils.js.map