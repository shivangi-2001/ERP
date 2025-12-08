import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router"; // or "react-router-dom" depending on version
import PageMeta from "../../../components/common/PageMeta";
import ClientEdit from "./Edit";
import ClientTeamForm from "../ClientTeam/Form";
import ClientTeamTable from "../ClientTeam/Table";
import { useGetClientDetailQuery } from "../../../service/project";
import { setClientDetail } from "../../../features/project";
import { RootState } from "../../../app/store";
import ClientTeamEdit from "../ClientTeam/Edit";
import ClientAssessmentTypeForm from "../ClientAssessment/Form";

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