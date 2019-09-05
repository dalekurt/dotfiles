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
const logger_1 = require("../logger");
// TODO: Consider NLS initialization/configuration here & have packages to import localize from here
exports.localize = nls.loadMessageBundle();
function processTemplate({ nlsKey, nlsTemplate, templateTokens = [], }) {
    const prettyTokens = [];
    const errors = [];
    if (templateTokens) {
        templateTokens.forEach(token => {
            if (token instanceof Error) {
                prettyTokens.push(token.message);
                errors.push(token);
            }
            else {
                prettyTokens.push(token);
            }
        });
    }
    const prettyMessage = exports.localize(nlsKey, nlsTemplate, ...prettyTokens);
    return {
        errors,
        prettyMessage,
    };
}
exports.processTemplate = processTemplate;
function log({ nlsKey, nlsTemplate, templateTokens, channel, level, logger }) {
    if (level === 'error') {
        channel.show(true);
    }
    const { prettyMessage, errors } = processTemplate({ nlsKey, nlsTemplate, templateTokens });
    channel.appendLine(prettyMessage);
    // TODO: Log in english if/when we get multi lang support
    // Log pretty message then Error objects (so logger might show stack traces)
    logger[level](...[prettyMessage, ...errors]);
}
/**
 * Wrapper around normal logger that writes to output channel and normal logs.
 * Avoids making two log statements when writing to output channel and improves consistency
 */
function getChannelLogger(channel, logger = logger_1.getLogger()) {
    return Object.freeze({
        channel,
        logger,
        verbose: (nlsKey, nlsTemplate, ...templateTokens) => log({
            level: 'verbose',
            nlsKey,
            nlsTemplate,
            templateTokens,
            channel,
            logger,
        }),
        debug: (nlsKey, nlsTemplate, ...templateTokens) => log({
            level: 'debug',
            nlsKey,
            nlsTemplate,
            templateTokens,
            channel,
            logger,
        }),
        info: (nlsKey, nlsTemplate, ...templateTokens) => log({
            level: 'info',
            nlsKey,
            nlsTemplate,
            templateTokens,
            channel,
            logger,
        }),
        warn: (nlsKey, nlsTemplate, ...templateTokens) => log({
            level: 'warn',
            nlsKey,
            nlsTemplate,
            templateTokens,
            channel,
            logger,
        }),
        error: (nlsKey, nlsTemplate, ...templateTokens) => log({
            level: 'error',
            nlsKey,
            nlsTemplate,
            templateTokens,
            channel,
            logger,
        })
    });
}
exports.getChannelLogger = getChannelLogger;
function getDebugPort() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Find available port
        return 5858;
    });
}
exports.getDebugPort = getDebugPort;
//# sourceMappingURL=vsCodeUtils.js.map