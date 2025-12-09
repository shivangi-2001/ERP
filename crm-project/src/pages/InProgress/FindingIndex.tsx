import FindingForm from "./FindingForm";
import FindingTable from "./FindingTable";

function FindingIndex() {
    return ( 
        <div className="grid grid-cols-2 gap-4">
            <FindingForm />
            <FindingTable />
        </div>
     );
}

export default FindingIndex;