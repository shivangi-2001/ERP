import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router"; 
import PageMeta from "../../../components/common/PageMeta";

import { RootState } from "../../../app/store";
import { setClientDetail } from "../../../features/project";
import { useGetClientDetailQuery } from "../../../service/project";

import ClientEdit from "./ClientEdit";
import ClientTeamForm from "../ClientTeam/ClientTeamForm";
import ClientTeamTable from "../ClientTeam/ClientTable";
import ClientTeamEdit from "../ClientTeam/ClientTeamEdit";
import ClientAssessmentTypeForm from "../../PentestManagement/ClientAssessment/Form";

const ClientIDIndex = () => {
    const { id } = useParams<{ id: string }>(); 
    const dispatch = useDispatch();
    
    const { isEditingTeam } = useSelector((state:RootState) => state.project)

    const { data, isLoading } = useGetClientDetailQuery(id, { skip: !id });

    useEffect(() => {
        if(data){
            dispatch(setClientDetail(data));
        }
    }, [dispatch, data]);

    if (isLoading) {
        return <div className="p-6">Loading Client Details...</div>;
    }

    return (
        <div>
            <PageMeta title={`Client Details`} description="" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                <div className="grid gap-4 h-fit">
                    <ClientEdit />
                    <ClientAssessmentTypeForm />
                </div>

                <div className="grid gap-4 h-fit">
                    <ClientTeamTable />
                    
                    {isEditingTeam ?<ClientTeamEdit /> :<ClientTeamForm />}
                </div>
            </div>
        </div>
    );
};

export default ClientIDIndex;