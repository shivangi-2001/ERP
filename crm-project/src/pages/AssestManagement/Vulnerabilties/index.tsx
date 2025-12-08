import React, { useEffect, useState } from "react";
import VulnerabilityTable from "./Table";
import VulnerabilityForm from "./Form";
import EditVulnerability from "./Edit";

const VulnerabilityIndex: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <VulnerabilityTable />
        <EditVulnerability />
      </div>
      <VulnerabilityForm />
    </div>
  );
};

export default VulnerabilityIndex;
