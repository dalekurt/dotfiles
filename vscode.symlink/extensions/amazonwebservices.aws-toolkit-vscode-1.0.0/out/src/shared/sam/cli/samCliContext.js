/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const samCliConfiguration_1 = require("./samCliConfiguration");
const samCliInvoker_1 = require("./samCliInvoker");
const samCliLocator_1 = require("./samCliLocator");
const samCliValidator_1 = require("./samCliValidator");
// Sam Cli Context is lazy loaded on first request to reduce the
// amount of work done during extension activation.
let samCliContext;
let samCliContextInitialized = false;
// Components required to load Sam Cli Context
let settingsConfiguration;
let logger;
function initialize(params) {
    settingsConfiguration = params.settingsConfiguration;
    logger = params.logger;
    samCliContext = undefined;
    samCliContextInitialized = true;
}
exports.initialize = initialize;
/**
 * Sam Cli Context is lazy loaded on first request
 */
function getSamCliContext() {
    if (!samCliContextInitialized) {
        throw new Error('SamCliContext not initialized! initialize() must be called prior to use.');
    }
    if (!samCliContext) {
        samCliContext = makeSamCliContext();
    }
    return samCliContext;
}
exports.getSamCliContext = getSamCliContext;
function makeSamCliContext() {
    const samCliConfiguration = new samCliConfiguration_1.DefaultSamCliConfiguration(settingsConfiguration, new samCliLocator_1.DefaultSamCliLocationProvider());
    const invokerContext = {
        cliConfig: samCliConfiguration,
        logger,
    };
    const invoker = new samCliInvoker_1.DefaultSamCliProcessInvoker(invokerContext);
    const validatorContext = new samCliValidator_1.DefaultSamCliValidatorContext(samCliConfiguration, invoker);
    const validator = new samCliValidator_1.DefaultSamCliValidator(validatorContext);
    const context = {
        invoker,
        validator,
    };
    return context;
}
//# sourceMappingURL=samCliContext.js.map