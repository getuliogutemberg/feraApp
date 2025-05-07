
import DashboardPBI from "../components/DashboardPBI.tsx";

interface DashPBIProps {
  pageId: string | null;
  reportId : string | null;
  workspaceId: string | null;
}

export default function DashPBI({ pageId, reportId,workspaceId }: DashPBIProps ) {
  
  return <div style={{
     border:'none',
     width:'100vw',
     height:'100vh',
    //  overflow:'hidden',
    //  display:'flex',
    //  justifyContent:'center',
     background:'#fff',
  }}>
  <DashboardPBI pageId={pageId} reportId={reportId} workspaceId={workspaceId} />
  </div>
  
}