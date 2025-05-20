import { Request, Response } from 'express';
import { msalClient, getReportDetails, generateEmbedToken } from '../utils/PBIEMBEDED';

// Interface para os parâmetros da requisição
interface TokenParams {
  pageId: string;
  reportId: string;
  workspaceId: string;
}

// Interface para a resposta do token
interface TokenResponse {
  accessToken: string;
  embedUrl: string;
  expiry: string;
  pageId: string;
}

class PBIController {
  async getPBIToken(req: Request<TokenParams>, res: Response) {
    const { pageId, reportId, workspaceId } = req.params;
    console.log('pageId:', pageId, 'reportId:', reportId, 'workspaceId:', workspaceId);

    try {
      // Adquire token de acesso
      const response = await msalClient.acquireTokenByClientCredential({
        scopes: ["https://analysis.windows.net/powerbi/api/.default"],
      });
      
      if (!response?.accessToken) {
        throw new Error("Falha ao obter token de acesso");
      }

      // Obtém detalhes do relatório
      const reportDetails = await getReportDetails(response.accessToken, reportId, workspaceId);
      
      // Gera token de embed
      const embedTokenResponse = await generateEmbedToken(
        response.accessToken, 
        reportDetails.datasetId,
        reportId
      );
      
      if (!embedTokenResponse) {
        throw new Error("Falha ao gerar token de embed");
      }

      // Monta resposta
      const tokenResponse: TokenResponse = {
        accessToken: embedTokenResponse.token,
        embedUrl: reportDetails.embedUrl,
        expiry: embedTokenResponse.expiration,
        pageId: pageId,
      };

      res.status(200).json(tokenResponse);
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao adquirir token:", err);
      res.status(500).json({ 
        error: "Falha ao adquirir token", 
        details: err.message 
      });
    }
  }
}

export default new PBIController();