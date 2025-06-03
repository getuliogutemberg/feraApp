import dotenv from "dotenv";
import { ConfidentialClientApplication } from '@azure/msal-node';
import fetch, { Headers } from 'node-fetch';

dotenv.config({ path: '../.env' });

// Interface para a configuração do Power BI
interface PowerBiConfig {
  workspaceId: string;
  reportId: string;
  pageId: string;
}

// Interface para os detalhes do relatório
interface ReportDetails {
  id: string;
  name: string;
  datasetId: string;
  [key: string]: any;
}

// Interface para o token de embed
interface EmbedToken {
  token: string;
  tokenId: string;
  expiration: string;
  [key: string]: any;
}

// Configuração do MSAL
export const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AZURE_APP_ID as string,
    clientSecret: process.env.AZURE_APP_SECRET as string,
    authority: "https://login.microsoftonline.com/"+ process.env.AZURE_APP_TENANTID as string,
  },
});

// Configuração do Power BI
export const config: PowerBiConfig = {
  workspaceId: process.env.POWER_BI_WORKSPACE_ID as string,
  reportId: "0a95eaa5-9435-47c8-b12d-10b4df2858c2",
  pageId: "d7d35c6daec9e7e50737",
};

/**
 * Obtém detalhes de um relatório específico do Power BI
 * @param token Token de acesso
 * @param reportId ID do relatório
 * @param workspaceId ID do workspace
 * @returns Promise com os detalhes do relatório
 */
export async function getReportDetails(token: string, reportId: string, workspaceId: string): Promise<ReportDetails> {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar relatório: ${response.statusText}`);
  }
  
  return response.json() as Promise<ReportDetails>;
}

export async function generateEmbedToken(token: string, datasetId: string, reportId: string): Promise<EmbedToken | null> {
  const url = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
  const body = JSON.stringify({
    reports: [{ id: reportId }],
    datasets: [{ id: datasetId }],
  });
  
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });

    const contentType = response.headers.get("content-type");
    let responseData: any;

    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage = responseData.error?.message || responseData;
      const errorCode = responseData.error?.code || "Desconhecido";
      throw new Error(`❌ ERRO ${response.status} - ${errorCode}: ${errorMessage}`);
    }

    return responseData as EmbedToken;
  } catch (error) {
    const err = error as Error;
    console.error("Erro ao adquirir token:", err.message);
    return null;
  }
}