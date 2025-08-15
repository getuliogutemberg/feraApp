"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PBIEMBEDED_1 = require("../utils/PBIEMBEDED");
class PBIController {
    async getPBIToken(req, res) {
        const { pageId, reportId, workspaceId } = req.params;
        console.log('pageId:', pageId, 'reportId:', reportId, 'workspaceId:', workspaceId);
        try {
            const response = await PBIEMBEDED_1.msalClient.acquireTokenByClientCredential({
                scopes: ["https://analysis.windows.net/powerbi/api/.default"],
            });
            if (!(response === null || response === void 0 ? void 0 : response.accessToken)) {
                throw new Error("Falha ao obter token de acesso");
            }
            const reportDetails = await (0, PBIEMBEDED_1.getReportDetails)(response.accessToken, reportId, workspaceId);
            const embedTokenResponse = await (0, PBIEMBEDED_1.generateEmbedToken)(response.accessToken, reportDetails.datasetId, reportId);
            if (!embedTokenResponse) {
                throw new Error("Falha ao gerar token de embed");
            }
            const tokenResponse = {
                accessToken: embedTokenResponse.token,
                embedUrl: reportDetails.embedUrl,
                expiry: embedTokenResponse.expiration,
                pageId: pageId,
            };
            res.status(200).json(tokenResponse);
        }
        catch (error) {
            const err = error;
            console.error("Erro ao adquirir token:", err);
            res.status(500).json({
                error: "Falha ao adquirir token",
                details: err.message
            });
        }
    }
}
exports.default = new PBIController();
//# sourceMappingURL=pbiController.js.map