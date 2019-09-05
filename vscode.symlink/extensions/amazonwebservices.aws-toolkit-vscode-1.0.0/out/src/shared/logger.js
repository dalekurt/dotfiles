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
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const nls = require("vscode-nls");
const winston = require("winston");
const constants_1 = require("./constants");
const filesystem_1 = require("./filesystem");
const filesystemUtilities_1 = require("./filesystemUtilities");
const settingsConfiguration_1 = require("./settingsConfiguration");
const telemetryUtils_1 = require("./telemetry/telemetryUtils");
const localize = nls.loadMessageBundle();
const LOG_RELATIVE_PATH = path.join('Code', 'logs', 'aws_toolkit');
const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_LOG_NAME = `aws_toolkit_${makeDateString('filename')}.log`;
const DEFAULT_OUTPUT_CHANNEL = vscode.window.createOutputChannel('AWS Toolkit Logs');
let defaultLogger;
/**
 * @param params: LoggerParams
 * Creates the "default logger" (returnable here and through getLogger) using specified parameters or default values.
 * Initializing again will create a new default logger
 * --however, existing logger objects using the old default logger will be unaffected.
 */
function initialize(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!params) {
            const logPath = getDefaultLogPath();
            const logFolder = path.dirname(logPath);
            if (!(yield filesystemUtilities_1.fileExists(logFolder))) {
                yield filesystem_1.mkdir(logFolder, { recursive: true });
            }
            defaultLogger = createLogger({
                outputChannel: DEFAULT_OUTPUT_CHANNEL,
                logPath
            });
            // only the default logger (with default params) gets a registered command
            // check list of registered commands to see if aws.viewLogs has already been registered.
            // if so, don't register again--this will cause an error visible to the user.
            for (const command of yield vscode.commands.getCommands(true)) {
                if (command === 'aws.viewLogs') {
                    return defaultLogger;
                }
            }
            telemetryUtils_1.registerCommand({
                command: 'aws.viewLogs',
                callback: () => __awaiter(this, void 0, void 0, function* () { return yield openLogFile(); })
            });
        }
        else {
            defaultLogger = createLogger(params);
        }
        if (defaultLogger.outputChannel) {
            defaultLogger.outputChannel.appendLine(localize('AWS.log.fileLocation', 'Error logs for this session are permanently stored in {0}', defaultLogger.logPath));
        }
        return defaultLogger;
    });
}
exports.initialize = initialize;
/**
 * Gets the default logger if it has been initialized with the initialize() function
 */
function getLogger() {
    if (defaultLogger) {
        return defaultLogger;
    }
    throw new Error('Default Logger not initialized. Call logger.initialize() first.');
}
exports.getLogger = getLogger;
/**
 * @param params: LoggerParams--nothing is required, but a LogPath is highly recommended so Winston doesn't throw errors
 *
 * Outputs a logger object that isn't stored anywhere--it's up to the caller to keep track of this.
 * No cleanup is REQUIRED, but if you wish to directly manipulate the log file while VSCode is still active,
 * you need to call releaseLogger. This will end the ability to write to the logfile with this logger instance.
 */
function createLogger(params) {
    let level;
    if (params.logLevel) {
        level = params.logLevel;
    }
    else {
        const configuration = new settingsConfiguration_1.DefaultSettingsConfiguration(constants_1.extensionSettingsPrefix);
        const setLevel = configuration.readSetting('logLevel');
        level = setLevel ? setLevel : DEFAULT_LOG_LEVEL;
    }
    const transports = [];
    if (params.logPath) {
        transports.push(new winston.transports.File({ filename: params.logPath }));
    }
    const newLogger = winston.createLogger({
        format: winston.format.combine(logFormat),
        level,
        transports
    });
    return {
        logPath: params.logPath,
        level,
        outputChannel: params.outputChannel,
        debug: (...message) => writeToLogs(generateWriteParams(newLogger, 'debug', message, params.outputChannel)),
        verbose: (...message) => writeToLogs(generateWriteParams(newLogger, 'verbose', message, params.outputChannel)),
        info: (...message) => writeToLogs(generateWriteParams(newLogger, 'info', message, params.outputChannel)),
        warn: (...message) => writeToLogs(generateWriteParams(newLogger, 'warn', message, params.outputChannel)),
        error: (...message) => writeToLogs(generateWriteParams(newLogger, 'error', message, params.outputChannel)),
        releaseLogger: () => releaseLogger(newLogger)
    };
}
exports.createLogger = createLogger;
function getDefaultLogPath() {
    if (os.platform() === 'win32') {
        return path.join(os.homedir(), 'AppData', 'Roaming', LOG_RELATIVE_PATH, DEFAULT_LOG_NAME);
    }
    else if (os.platform() === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', LOG_RELATIVE_PATH, DEFAULT_LOG_NAME);
    }
    else {
        return path.join(os.homedir(), '.config', LOG_RELATIVE_PATH, DEFAULT_LOG_NAME);
    }
}
function openLogFile() {
    return __awaiter(this, void 0, void 0, function* () {
        if (defaultLogger.logPath) {
            yield vscode.window.showTextDocument(vscode.Uri.file(path.normalize(defaultLogger.logPath)));
        }
    });
}
function releaseLogger(logger) {
    logger.clear();
}
function formatMessage(level, message) {
    let final = `${makeDateString('logfile')} [${level.toUpperCase()}]:`;
    for (const chunk of message) {
        if (chunk instanceof Error) {
            final = `${final} ${chunk.stack}`;
        }
        else {
            final = `${final} ${chunk}`;
        }
    }
    return final;
}
function writeToLogs(params) {
    const message = formatMessage(params.level, params.message);
    params.logger.log(params.level, message);
    if (params.outputChannel) {
        writeToOutputChannel(params.logger.levels[params.level], params.logger.levels[params.logger.level], message, params.outputChannel);
    }
}
function writeToOutputChannel(messageLevel, logLevel, message, outputChannel) {
    // using default Winston log levels (mapped to numbers): https://github.com/winstonjs/winston#logging
    if (messageLevel <= logLevel) {
        outputChannel.appendLine(message);
    }
}
// outputs a timestamp with the following formattings:
// type: 'filename' = YYYYMMDDThhmmss (note the 'T' prior to time, matches VS Code's log file name format)
// type: 'logFile' = YYYY-MM-DD HH:MM:SS
// Uses local timezone
function makeDateString(type) {
    const d = new Date();
    const isFilename = type === 'filename';
    return `${d.getFullYear()}${isFilename ? '' : '-'}` +
        // String.prototype.padStart() was introduced in ES7, but we target ES6.
        `${padNumber(d.getMonth() + 1)}${isFilename ? '' : '-'}` +
        `${padNumber(d.getDate())}${isFilename ? 'T' : ' '}` +
        `${padNumber(d.getHours())}${isFilename ? '' : ':'}` +
        `${padNumber(d.getMinutes())}${isFilename ? '' : ':'}` +
        `${padNumber(d.getSeconds())}`;
}
function padNumber(num) {
    return num < 10 ? '0' + num.toString() : num.toString();
}
function generateWriteParams(logger, level, message, outputChannel) {
    return { logger: logger, level: level, message: message, outputChannel: outputChannel };
}
// forces winston to output only pre-formatted message
const logFormat = winston.format.printf(({ message }) => {
    return message;
});
//# sourceMappingURL=logger.js.map