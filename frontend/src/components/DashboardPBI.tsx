import React, { useEffect, useRef, useState } from 'react';
import { service, factories, models, Report } from 'powerbi-client';
import axios from 'axios';


interface ReportDetails {
  accessToken: string;
  embedUrl: string;
  pageId: string;
}


interface DashboardPBIPageProps {
  pageId: string | null;
  reportId: string | null;
  workspaceId: string | null;
}

const DashboardPBI: React.FC<DashboardPBIPageProps> = ({ pageId,reportId,workspaceId}) => {
  const [reportDetails, setReportDetails] = useState<ReportDetails>();
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const reportRef = useRef<Report | null>(null);
  const powerBiService = useRef<service.Service>(
    new service.Service(
      factories.hpmFactory,
      factories.wpmpFactory,
      factories.routerFactory
    )
  );


  // Busca os detalhes do relatório (token + embedUrl)
  useEffect(() => {
    if (!pageId || !reportId || !workspaceId) return;

    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getPBIToken/${pageId}/${reportId}/${workspaceId}`);
        console.log({
          accessToken: response.data.accessToken,
          embedUrl: response.data.embedUrl,
          pageId,
        });
        setReportDetails({
          accessToken: response.data.accessToken,
          embedUrl: response.data.embedUrl,
          pageId,
        });
      } catch (error) {
        setErrorMessage('Erro ao buscar detalhes do relatório');
        console.error('Erro ao buscar detalhes do relatório:', error);
      }
    };

    fetchReportDetails();
  }, [pageId,reportId,workspaceId]);


   // Embeda o relatório
  useEffect(() => {
    if (!pageId || !reportDetails) return;

    const containerId = `powerbi-container-${pageId}`;
    const reportContainer = document.getElementById(containerId);
    if (!reportContainer) return;

    // Reset se já tiver algo embedado
    powerBiService.current.reset(reportContainer);

    const config: models.IEmbedConfiguration = {
      type: 'report',
      embedUrl: reportDetails.embedUrl,
      accessToken: reportDetails.accessToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: false },
        },
        navContentPaneEnabled: false,
        background: models.BackgroundType.Default,
        layoutType: models.LayoutType.Custom,
        customLayout: {
          displayOption: models.DisplayOption.FitToPage,
        },
      },
    };

    try {
      const embeddedReport = powerBiService.current.embed(reportContainer, config) as Report;
      reportRef.current = embeddedReport;

      embeddedReport.on('loaded', async () => {
        try {
          const pages = await embeddedReport.getPages();
          const targetPage = pages.find((page) => page.name === pageId);
          if (targetPage) {
            await targetPage.setActive();
          } else {
            console.error('Página especificada não encontrada.');
          }
        } catch (error) {
          console.error('Erro ao carregar páginas:', error);
        }
      });

      embeddedReport.on('error', (event: { detail: string }) =>
        console.error(event.detail)
      );
    } catch (error) {
      console.error('Erro ao embutir o relatório:', error);
    }

    // Cleanup ao desmontar
    return () => {
      if (reportRef.current && reportContainer) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        powerBiService.current.reset(reportContainer);
        reportRef.current = null;
      }
    };
  }, [pageId, reportDetails]);


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // background:"red",
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 50px)',
        width: 'calc(100vw - 80px)',
        margin:"15px",
        overflow: 'hidden',
        position: 'fixed',
        top: '40px', // altura do header
        left: '65px', // largura do menu lateral
        // right: '0',
        // bottom: '0'
      }}
    >
      {reportDetails ? 
        <div 
          style={{
            flexGrow :1,
            
            display:'flex',
            
            justifyContent: "center",
            alignItems: "center",
           
          }}
        >
          <div 
            style={{
              display:'flex',
              flexGrow :1,

              justifyContent: 'center',
              alignItems: 'center',
              
            }}
          >
            <div 
              style={{
                flexGrow :1,
                height: 'calc(100vh - 60px)',
                width:"calc(100vw - 80px)",
                
              }} 
              id={`powerbi-container-${pageId}`} 
            />
          </div>
        </div>
      : errorMessage ? 
        <p style={{ 
          display: "flex", 
          background: "rgba(49, 131, 207, 0)",
          width: '100%',
          justifyContent: "center",
          color: "black",
        }}>
          {errorMessage}
        </p> 
      : 
        <p style={{ 
          display: "flex", 
          background: "rgba(49, 131, 207, 0)",
          width: '100%',
          justifyContent: "center",
          color: "black",
        }}>
          Carregando relatório...
        </p>
      }
    </div>
  );
};

export default DashboardPBI;
