"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const node_1 = require("./node");
const explorer_1 = require("./explorer");
class HelmReleaseNode extends node_1.ClusterExplorerNodeImpl {
    constructor(releaseName, status) {
        super(explorer_1.NODE_TYPES.helm.release);
        this.releaseName = releaseName;
        this.status = status;
        this.nodeType = explorer_1.NODE_TYPES.helm.release;
    }
    getChildren(_kubectl, _host) {
        return [];
    }
    getTreeItem() {
        const treeItem = new vscode.TreeItem(this.releaseName, vscode.TreeItemCollapsibleState.None);
        treeItem.command = {
            command: "extension.helmGet",
            title: "Get",
            arguments: [this]
        };
        treeItem.contextValue = "vsKubernetes.helmRelease";
        treeItem.iconPath = getIconForHelmRelease(this.status.toLowerCase());
        return treeItem;
    }
    apiURI(_kubectl, _namespace) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
}
exports.HelmReleaseNode = HelmReleaseNode;
function getIconForHelmRelease(status) {
    if (status === "deployed") {
        return vscode.Uri.file(path.join(__dirname, "../../../../images/helmDeployed.svg"));
    }
    else {
        return vscode.Uri.file(path.join(__dirname, "../../../../images/helmFailed.svg"));
    }
}
//# sourceMappingURL=node.helmrelease.js.map