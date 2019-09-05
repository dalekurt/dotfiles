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
const vscode = require("vscode");
const nls = require("vscode-nls");
const createNewSamApp_1 = require("./lambda/commands/createNewSamApp");
const samParameterCompletionItemProvider_1 = require("./lambda/config/samParameterCompletionItemProvider");
const lambdaTreeDataProvider_1 = require("./lambda/lambdaTreeDataProvider");
const awsClientBuilder_1 = require("./shared/awsClientBuilder");
const awsContextTreeCollection_1 = require("./shared/awsContextTreeCollection");
const defaultToolkitClientBuilder_1 = require("./shared/clients/defaultToolkitClientBuilder");
const csLensProvider = require("./shared/codelens/csharpCodeLensProvider");
const pyLensProvider = require("./shared/codelens/pythonCodeLensProvider");
const tsLensProvider = require("./shared/codelens/typescriptCodeLensProvider");
const constants_1 = require("./shared/constants");
const defaultCredentialsFileReaderWriter_1 = require("./shared/credentials/defaultCredentialsFileReaderWriter");
const userCredentialsUtils_1 = require("./shared/credentials/userCredentialsUtils");
const defaultAwsContext_1 = require("./shared/defaultAwsContext");
const defaultAwsContextCommands_1 = require("./shared/defaultAwsContextCommands");
const defaultResourceFetcher_1 = require("./shared/defaultResourceFetcher");
const defaultStatusBar_1 = require("./shared/defaultStatusBar");
const extensionGlobals_1 = require("./shared/extensionGlobals");
const extensionUtilities_1 = require("./shared/extensionUtilities");
const logFactory = require("./shared/logger");
const defaultRegionProvider_1 = require("./shared/regions/defaultRegionProvider");
const SamCliContext = require("./shared/sam/cli/samCliContext");
const SamCliDetection = require("./shared/sam/cli/samCliDetection");
const settingsConfiguration_1 = require("./shared/settingsConfiguration");
const awsTelemetryOptOut_1 = require("./shared/telemetry/awsTelemetryOptOut");
const defaultTelemetryService_1 = require("./shared/telemetry/defaultTelemetryService");
const telemetryTypes_1 = require("./shared/telemetry/telemetryTypes");
const telemetryUtils_1 = require("./shared/telemetry/telemetryUtils");
const disposableFiles_1 = require("./shared/utilities/disposableFiles");
const promiseUtilities_1 = require("./shared/utilities/promiseUtilities");
const vsCodeUtils_1 = require("./shared/utilities/vsCodeUtils");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const env = process.env;
        if (!!env.VSCODE_NLS_CONFIG) {
            nls.config(JSON.parse(env.VSCODE_NLS_CONFIG))();
        }
        else {
            nls.config()();
        }
        const localize = nls.loadMessageBundle();
        extensionGlobals_1.ext.context = context;
        yield logFactory.initialize();
        const toolkitOutputChannel = vscode.window.createOutputChannel(localize('AWS.channel.aws.toolkit', 'AWS Toolkit'));
        try {
            yield new defaultCredentialsFileReaderWriter_1.DefaultCredentialsFileReaderWriter().setCanUseConfigFileIfExists();
            const awsContext = new defaultAwsContext_1.DefaultAwsContext(new settingsConfiguration_1.DefaultSettingsConfiguration(constants_1.extensionSettingsPrefix), context);
            const awsContextTrees = new awsContextTreeCollection_1.AwsContextTreeCollection();
            const resourceFetcher = new defaultResourceFetcher_1.DefaultResourceFetcher();
            const regionProvider = new defaultRegionProvider_1.DefaultRegionProvider(context, resourceFetcher);
            extensionGlobals_1.ext.awsContextCommands = new defaultAwsContextCommands_1.DefaultAWSContextCommands(awsContext, awsContextTrees, regionProvider);
            extensionGlobals_1.ext.sdkClientBuilder = new awsClientBuilder_1.DefaultAWSClientBuilder(awsContext);
            extensionGlobals_1.ext.toolkitClientBuilder = new defaultToolkitClientBuilder_1.DefaultToolkitClientBuilder();
            // check to see if current user is valid
            const currentProfile = awsContext.getCredentialProfileName();
            if (currentProfile) {
                const successfulLogin = yield userCredentialsUtils_1.UserCredentialsUtils.addUserDataToContext(currentProfile, awsContext);
                if (!successfulLogin) {
                    yield userCredentialsUtils_1.UserCredentialsUtils.removeUserDataFromContext(awsContext);
                    // tslint:disable-next-line: no-floating-promises
                    userCredentialsUtils_1.UserCredentialsUtils.notifyUserCredentialsAreBad(currentProfile);
                }
            }
            extensionGlobals_1.ext.statusBar = new defaultStatusBar_1.DefaultAWSStatusBar(awsContext, context);
            extensionGlobals_1.ext.telemetry = new defaultTelemetryService_1.DefaultTelemetryService(context, awsContext);
            new awsTelemetryOptOut_1.AwsTelemetryOptOut(extensionGlobals_1.ext.telemetry, new settingsConfiguration_1.DefaultSettingsConfiguration(constants_1.extensionSettingsPrefix))
                .ensureUserNotified()
                .catch((err) => {
                console.warn(`Exception while displaying opt-out message: ${err}`);
            });
            yield extensionGlobals_1.ext.telemetry.start();
            context.subscriptions.push(...yield activateCodeLensProviders(awsContext.settingsConfiguration, toolkitOutputChannel, extensionGlobals_1.ext.telemetry));
            telemetryUtils_1.registerCommand({
                command: 'aws.login',
                callback: () => __awaiter(this, void 0, void 0, function* () { return yield extensionGlobals_1.ext.awsContextCommands.onCommandLogin(); }),
                telemetryName: {
                    namespace: telemetryTypes_1.TelemetryNamespace.Aws,
                    name: 'credentialslogin'
                }
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.credential.profile.create',
                callback: () => __awaiter(this, void 0, void 0, function* () { return yield extensionGlobals_1.ext.awsContextCommands.onCommandCreateCredentialsProfile(); }),
                telemetryName: {
                    namespace: telemetryTypes_1.TelemetryNamespace.Aws,
                    name: 'credentialscreate'
                }
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.logout',
                callback: () => __awaiter(this, void 0, void 0, function* () { return yield extensionGlobals_1.ext.awsContextCommands.onCommandLogout(); }),
                telemetryName: {
                    namespace: telemetryTypes_1.TelemetryNamespace.Aws,
                    name: 'credentialslogout'
                }
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.showRegion',
                callback: () => __awaiter(this, void 0, void 0, function* () { return yield extensionGlobals_1.ext.awsContextCommands.onCommandShowRegion(); })
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.hideRegion',
                callback: (node) => __awaiter(this, void 0, void 0, function* () {
                    yield extensionGlobals_1.ext.awsContextCommands.onCommandHideRegion(extensionUtilities_1.safeGet(node, x => x.regionCode));
                })
            });
            // register URLs in extension menu
            telemetryUtils_1.registerCommand({
                command: 'aws.help',
                callback: () => __awaiter(this, void 0, void 0, function* () { vscode.env.openExternal(vscode.Uri.parse(constants_1.documentationUrl)); })
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.github',
                callback: () => __awaiter(this, void 0, void 0, function* () { vscode.env.openExternal(vscode.Uri.parse(constants_1.githubUrl)); })
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.reportIssue',
                callback: () => __awaiter(this, void 0, void 0, function* () { vscode.env.openExternal(vscode.Uri.parse(constants_1.reportIssueUrl)); })
            });
            telemetryUtils_1.registerCommand({
                command: 'aws.quickStart',
                callback: () => __awaiter(this, void 0, void 0, function* () { yield extensionUtilities_1.showQuickStartWebview(context); })
            });
            const providers = [
                new lambdaTreeDataProvider_1.LambdaTreeDataProvider(awsContext, awsContextTrees, regionProvider, resourceFetcher, vsCodeUtils_1.getChannelLogger(toolkitOutputChannel), (relativeExtensionPath) => getExtensionAbsolutePath(context, relativeExtensionPath))
            ];
            providers.forEach((p) => {
                p.initialize(context);
                context.subscriptions.push(vscode.window.registerTreeDataProvider(p.viewProviderId, p));
            });
            yield extensionGlobals_1.ext.statusBar.updateContext(undefined);
            yield initializeSamCli(new settingsConfiguration_1.DefaultSettingsConfiguration(constants_1.extensionSettingsPrefix), logFactory.getLogger());
            yield disposableFiles_1.ExtensionDisposableFiles.initialize(context);
            vscode.languages.registerCompletionItemProvider({
                language: 'json',
                scheme: 'file',
                pattern: '**/.aws/parameters.json'
            }, new samParameterCompletionItemProvider_1.SamParameterCompletionItemProvider(), '"');
            extensionUtilities_1.toastNewUser(context, logFactory.getLogger());
            yield createNewSamApp_1.resumeCreateNewSamApp(context);
        }
        catch (error) {
            const channelLogger = vsCodeUtils_1.getChannelLogger(toolkitOutputChannel);
            channelLogger.error('AWS.channel.aws.toolkit.activation.error', 'Error Activating AWS Toolkit', error);
            throw error;
        }
    });
}
exports.activate = activate;
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield extensionGlobals_1.ext.telemetry.shutdown();
    });
}
exports.deactivate = deactivate;
function activateCodeLensProviders(configuration, toolkitOutputChannel, telemetryService) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        const providerParams = {
            configuration,
            outputChannel: toolkitOutputChannel,
            telemetryService,
        };
        tsLensProvider.initialize(providerParams);
        disposables.push(vscode.languages.registerCodeLensProvider([
            {
                language: 'javascript',
                scheme: 'file',
            },
        ], tsLensProvider.makeTypescriptCodeLensProvider()));
        yield pyLensProvider.initialize(providerParams);
        disposables.push(vscode.languages.registerCodeLensProvider(pyLensProvider.PYTHON_ALLFILES, yield pyLensProvider.makePythonCodeLensProvider(new settingsConfiguration_1.DefaultSettingsConfiguration('python'))));
        yield csLensProvider.initialize(providerParams);
        disposables.push(vscode.languages.registerCodeLensProvider(csLensProvider.CSHARP_ALLFILES, yield csLensProvider.makeCSharpCodeLensProvider()));
        return disposables;
    });
}
/**
 * Performs SAM CLI relevant extension initialization
 */
function initializeSamCli(settingsConfiguration, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        SamCliContext.initialize({ settingsConfiguration, logger });
        telemetryUtils_1.registerCommand({
            command: 'aws.samcli.detect',
            callback: () => __awaiter(this, void 0, void 0, function* () {
                return yield promiseUtilities_1.PromiseSharer.getExistingPromiseOrCreate('samcli.detect', () => __awaiter(this, void 0, void 0, function* () { return yield SamCliDetection.detectSamCli(true); }));
            })
        });
        yield SamCliDetection.detectSamCli(false);
    });
}
function getExtensionAbsolutePath(context, relativeExtensionPath) {
    return context.asAbsolutePath(relativeExtensionPath);
}
//# sourceMappingURL=extension.js.map