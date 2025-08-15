"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.msalClient = void 0;
exports.getReportDetails = getReportDetails;
exports.generateEmbedToken = generateEmbedToken;
const dotenv_1 = __importDefault(require("dotenv"));
const msal_node_1 = require("@azure/msal-node");
const node_fetch_1 = __importStar(require("node-fetch"));
dotenv_1.default.config({ path: '../.env' });
exports.msalClient = new msal_node_1.ConfidentialClientApplication({
    auth: {
        clientId: process.env.AZURE_APP_ID,
        clientSecret: process.env.AZURE_APP_SECRET,
        authority: "https://login.microsoftonline.com/" + process.env.AZURE_APP_TENANTID,
    },
});
exports.config = {
    workspaceId: process.env.POWER_BI_WORKSPACE_ID,
    reportId: "0a95eaa5-9435-47c8-b12d-10b4df2858c2",
    pageId: "d7d35c6daec9e7e50737",
};
async function getReportDetails(token, reportId, workspaceId) {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = new node_fetch_1.Headers({ Authorization: `Bearer ${token}` });
    const response = await (0, node_fetch_1.default)(url, { headers });
    if (!response.ok) {
        throw new Error(`Erro ao buscar relatório: ${response.statusText}`);
    }
    return response.json();
}
async function generateEmbedToken(token, datasetId, reportId) {
    var _a, _b;
    const url = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const body = JSON.stringify({
        reports: [{ id: reportId }],
        datasets: [{ id: datasetId }],
    });
    const headers = new node_fetch_1.Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });
    try {
        const response = await (0, node_fetch_1.default)(url, { method: "POST", headers, body });
        const contentType = response.headers.get("content-type");
        let responseData;
        if (contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json")) {
            responseData = await response.json();
        }
        else {
            responseData = await response.text();
        }
        if (!response.ok) {
            const errorMessage = ((_a = responseData.error) === null || _a === void 0 ? void 0 : _a.message) || responseData;
            const errorCode = ((_b = responseData.error) === null || _b === void 0 ? void 0 : _b.code) || "Desconhecido";
            throw new Error(`❌ ERRO ${response.status} - ${errorCode}: ${errorMessage}`);
        }
        return responseData;
    }
    catch (error) {
        const err = error;
        console.error("Erro ao adquirir token:", err.message);
        return null;
    }
}
//# sourceMappingURL=PBIEMBEDED.js.map