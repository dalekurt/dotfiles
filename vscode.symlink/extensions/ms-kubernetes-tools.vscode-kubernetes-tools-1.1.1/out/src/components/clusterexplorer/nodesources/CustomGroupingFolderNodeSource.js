"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_folder_grouping_custom_1 = require("../node.folder.grouping.custom");
const extension_nodesources_1 = require("./extension.nodesources");
class CustomGroupingFolderNodeSource extends extension_nodesources_1.NodeSource {
    constructor(displayName, contextValue, children) {
        super();
        this.displayName = displayName;
        this.contextValue = contextValue;
        this.children = children;
    }
    nodes(_kubectl, _host) {
        return __awaiter(this, void 0, void 0, function* () {
            return [new node_folder_grouping_custom_1.ContributedGroupingFolderNode(this.displayName, this.contextValue, this.children)];
        });
    }
}
exports.CustomGroupingFolderNodeSource = CustomGroupingFolderNodeSource;
//# sourceMappingURL=CustomGroupingFolderNodeSource.js.map