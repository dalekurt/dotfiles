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
const node_folder_resource_1 = require("../node.folder.resource");
const extension_nodesources_1 = require("./extension.nodesources");
class CustomResourceFolderNodeSource extends extension_nodesources_1.NodeSource {
    constructor(resourceKind, options) {
        super();
        this.resourceKind = resourceKind;
        this.options = options;
    }
    nodes(_kubectl, _host) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsImpl = extension_nodesources_1.adaptOptions(this.options);
            return [node_folder_resource_1.ResourceFolderNode.create(this.resourceKind, optionsImpl)];
        });
    }
}
exports.CustomResourceFolderNodeSource = CustomResourceFolderNodeSource;
//# sourceMappingURL=CustomResourceFolderNodeSource.js.map