/*!
 * Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
const path = require("path");
const vscode = require("vscode");
const filesystemUtilities_1 = require("../../shared/filesystemUtilities");
const samCliContext_1 = require("../../shared/sam/cli/samCliContext");
const samCliInit_1 = require("../../shared/sam/cli/samCliInit");
const samCliValidationUtils_1 = require("../../shared/sam/cli/samCliValidationUtils");
const telemetryTypes_1 = require("../../shared/telemetry/telemetryTypes");
const messages_1 = require("../../shared/utilities/messages");
const samInitWizard_1 = require("../wizards/samInitWizard");
exports.URI_TO_OPEN_ON_INIT_KEY = 'URI_TO_OPEN_ON_INIT_KEY';
function resumeCreateNewSamApp(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawUri = context.globalState.get(exports.URI_TO_OPEN_ON_INIT_KEY);
        if (!rawUri) {
            return;
        }
        try {
            const uri = vscode.Uri.file(rawUri);
            if (!vscode.workspace.getWorkspaceFolder(uri)) {
                // This should never happen, as `rawUri` will only be set if `uri` is in the newly added workspace folder.
                vscode.window.showErrorMessage(localize('AWS.samcli.initWizard.source.error.notInWorkspace', 'Could not open file \'{0}\'. If this file exists on disk, try adding it to your workspace.', uri.fsPath));
                return;
            }
            yield vscode.window.showTextDocument(uri);
        }
        finally {
            context.globalState.update(exports.URI_TO_OPEN_ON_INIT_KEY, undefined);
        }
    });
}
exports.resumeCreateNewSamApp = resumeCreateNewSamApp;
/**
 * Runs `sam init` in the given context and returns useful metadata about its invocation
 */
function createNewSamApplication(channelLogger, extensionContext, samCliContext = samCliContext_1.getSamCliContext()) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = {
            reason: 'unknown',
            result: 'fail',
            runtime: 'unknown',
        };
        try {
            yield validateSamCli(samCliContext.validator);
            const wizardContext = new samInitWizard_1.DefaultCreateNewSamAppWizardContext(extensionContext);
            const config = yield new samInitWizard_1.CreateNewSamAppWizard(wizardContext).run();
            if (!config) {
                results.result = 'cancel';
                results.reason = 'userCancelled';
                return results;
            }
            results.runtime = config.runtime;
            const initArguments = {
                name: config.name,
                location: config.location.fsPath,
                runtime: config.runtime,
            };
            yield samCliInit_1.runSamCliInit(initArguments, samCliContext.invoker);
            results.result = 'pass';
            const uri = yield getMainUri(config);
            if (!uri) {
                results.reason = 'fileNotFound';
                return results;
            }
            if (yield addWorkspaceFolder({
                uri: config.location,
                name: path.basename(config.location.fsPath)
            }, uri)) {
                extensionContext.globalState.update(exports.URI_TO_OPEN_ON_INIT_KEY, uri.fsPath);
            }
            else {
                yield vscode.window.showTextDocument(uri);
            }
            results.reason = 'complete';
        }
        catch (err) {
            const checkLogsMessage = messages_1.makeCheckLogsMessage();
            channelLogger.channel.show(true);
            channelLogger.error('AWS.samcli.initWizard.general.error', 'An error occurred while creating a new SAM Application. {0}', checkLogsMessage);
            const error = err;
            channelLogger.logger.error(error);
            results.result = 'fail';
            results.reason = 'error';
        }
        return results;
    });
}
exports.createNewSamApplication = createNewSamApplication;
function validateSamCli(samCliValidator) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationResult = yield samCliValidator.detectValidSamCli();
        samCliValidationUtils_1.throwAndNotifyIfInvalid(validationResult);
    });
}
function getMainUri(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const samTemplatePath = path.resolve(config.location.fsPath, config.name, 'template.yaml');
        if (yield filesystemUtilities_1.fileExists(samTemplatePath)) {
            return vscode.Uri.file(samTemplatePath);
        }
        else {
            vscode.window.showWarningMessage(localize('AWS.samcli.initWizard.source.error.notFound', 'Project created successfully, but main source code file not found: {0}', samTemplatePath));
        }
    });
}
function addWorkspaceFolder(folder, fileToOpen) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        // No-op if the folder is already in the workspace.
        if (vscode.workspace.getWorkspaceFolder(folder.uri)) {
            return false;
        }
        let updateExistingWorkspacePromise;
        try {
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                updateExistingWorkspacePromise = new Promise((resolve, reject) => {
                    try {
                        const watcher = vscode.workspace.createFileSystemWatcher(fileToOpen.fsPath);
                        disposables.push(watcher);
                        const listener = (uri) => {
                            try {
                                if (path.relative(uri.fsPath, fileToOpen.fsPath)) {
                                    resolve();
                                }
                            }
                            catch (err) {
                                reject(err);
                            }
                        };
                        watcher.onDidCreate(listener, undefined, disposables);
                        watcher.onDidChange(listener, undefined, disposables);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            if (!vscode.workspace.updateWorkspaceFolders(
            // Add new folder to the end of the list rather than the beginning, to avoid VS Code
            // terminating and reinitializing our extension.
            (vscode.workspace.workspaceFolders || []).length, 0, folder)) {
                console.error('Could not update workspace folders');
                return false;
            }
            if (updateExistingWorkspacePromise) {
                yield updateExistingWorkspacePromise;
            }
        }
        finally {
            for (const disposable of disposables) {
                disposable.dispose();
            }
        }
        // Return true if the current process will be terminated by VS Code (because the first workspaceFolder was changed)
        return !updateExistingWorkspacePromise;
    });
}
function applyResultsToMetadata(createResults, metadata) {
    let metadataResult;
    switch (createResults.result) {
        case 'pass':
            metadataResult = telemetryTypes_1.MetadataResult.Pass;
            break;
        case 'cancel':
            metadataResult = telemetryTypes_1.MetadataResult.Cancel;
            break;
        case 'fail':
        default:
            metadataResult = telemetryTypes_1.MetadataResult.Fail;
            break;
    }
    metadata.set('runtime', createResults.runtime);
    metadata.set(telemetryTypes_1.METADATA_FIELD_NAME.RESULT, metadataResult.toString());
    metadata.set(telemetryTypes_1.METADATA_FIELD_NAME.REASON, createResults.reason);
}
exports.applyResultsToMetadata = applyResultsToMetadata;
//# sourceMappingURL=createNewSamApp.js.map