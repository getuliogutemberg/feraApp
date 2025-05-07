const { ConfidentialClientApplication } = require('@azure/msal-node');


const {  getReportDetails,
    generateEmbedToken,
    msalClient,
    config, } = require("./utils/PBIEMBEDED");

const msalClient = new ConfidentialClientApplication({
    auth: {
      clientId: process.env.AZURE_APP_ID,
      clientSecret: process.env.AZURE_APP_SECRET,
      authority: `https://login.microsoftonline.com/${process.env.AZURE_APP_TENANTID}`,
    },
  });
  
const config = {
workspaceId: process.env.POWER_BI_WORKSPACE_ID,
reportId: "0a95eaa5-9435-47c8-b12d-10b4df2858c2",
pageId: "d7d35c6daec9e7e50737",
};


  async function getReportDetails(token) {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${config.reportId}`;
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Erro ao buscar relatório: ${response.statusText}`);
    }
    return response.json();
  }
  
  async function generateEmbedToken(token, datasetId) {
    const url = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const body = JSON.stringify({
      reports: [{ id: config.reportId }],
      datasets: [{ id: datasetId }],
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await fetch(url, { method: "POST", headers, body });
  
      const contentType = response.headers.get("content-type");
      let responseData;
  
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
  
      if (!response.ok) {
        throw new Error(
          `❌ ERRO ${response.status} - ${responseData.error?.code || "Desconhecido"}: ${responseData.error?.message || responseData}`
        );
      }
  
      return responseData;
    } catch (error) {
      console.error("Erro ao adquirir token:", error.message);
      return null; // Retorna `null` para evitar quebra no fluxo
    }
  }
  
module.exports = {
    getReportDetails,
    generateEmbedToken,
    msalClient,
    config,
  };    
