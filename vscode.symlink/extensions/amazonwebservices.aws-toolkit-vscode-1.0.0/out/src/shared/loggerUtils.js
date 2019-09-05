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
const del = require("del");
const path = require("path");
const filesystemUtilities = require("./filesystemUtilities");
const l = require("./logger");
class TestLogger {
    /**
     * initializes a default logger. This persists through all tests.
     * initializing a default logger means that any tested files with logger statements will work.
     * as a best practice, please initialize a TestLogger before running tests on a file with logger statements.
     *
     * @param logFolder - Folder to be managed by this object. Will be deleted on cleanup
     * @param logger - Logger to work with
     */
    constructor(logFolder, logger) {
        this.logFolder = logFolder;
        this.logger = logger;
    }
    // cleanupLogger clears out the logger's transports, but the logger will still exist as a default
    // this means that the default logger will still work for other files but will output an error
    cleanupLogger() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.releaseLogger();
            if (yield filesystemUtilities.fileExists(this.logFolder)) {
                yield del(this.logFolder, { force: true });
            }
        });
    }
    logContainsText(str) {
        return __awaiter(this, void 0, void 0, function* () {
            const logText = yield filesystemUtilities.readFileAsString(TestLogger.getLogPath(this.logFolder));
            return logText.includes(str);
        });
    }
    static createTestLogger() {
        return __awaiter(this, void 0, void 0, function* () {
            const logFolder = yield filesystemUtilities.makeTemporaryToolkitFolder();
            const logger = yield l.initialize({
                logPath: TestLogger.getLogPath(logFolder),
                logLevel: 'debug'
            });
            return new TestLogger(logFolder, logger);
        });
    }
    static getLogPath(logFolder) {
        return path.join(logFolder, 'temp.log');
    }
}
exports.TestLogger = TestLogger;
//# sourceMappingURL=loggerUtils.js.map