import { BrowserRouter as Router, Routes, Route } from "react-router";
import CookieConsent from "react-cookie-consent";

// Authentication
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
// Other Pages
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import ProtectedRoute from "./layout/ProtectedLayout";

// Project Management
import OnBoardIndex from "./pages/ProjectManagement/Onboard/Index";
// import ClientID from "./components/Client/clientId";
import ManageIndex from "./pages/ProjectManagement/Manage/Index";

// Assessment Type
import AssessmentType from "./pages/AssestManagement/AssessmentType";
import VulnerabilityIndex from "./pages/AssestManagement/Vulnerabilties";
import ClientIDIndex from "./pages/ProjectManagement/ClientID/Index";
import ComplianceType from "./pages/AssestManagement/ComplianceType";

// Team Management
import TeamGroup from "./pages/TeamManagement/teamGroup";
import EmployeeIndex from "./pages/TeamManagement/employeeIndex";
import UrlMappingIndex from "./pages/ProjectManagement/UrlMapping/Index";
import InProgressIndex from "./pages/InProgress/Index";
import FindingIndex from "./pages/InProgress/FindingIndex";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />

        <CookieConsent
          location="bottom"
          buttonText="I Understand"
          cookieName="myAppCookieConsent"
          style={{ background: "#2B373B", zIndex: 9999 }} // High zIndex ensures it's on top
          buttonStyle={{ color: "#4e503b", fontSize: "13px", borderRadius: "5px" }}
          expires={150}
        >
          We use cookies to enhance your user experience. By using our website, you agress to our use of cookies.
        </CookieConsent>

        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Project Management Pages */}
            <Route index path="/" element={<OnBoardIndex />} />
            <Route index path="/on-board" element={<OnBoardIndex />} />
            <Route index path="/clients/:id" element={<ClientIDIndex />}/>
            <Route index path="/manage" element={<ManageIndex />} />
            <Route index path="/client/:id" element={<UrlMappingIndex/>} />
            
            {/* Assest Management */}
            <Route  path="/asessment-type" element={<AssessmentType />}/>
            <Route  path="/vulnerabilities" element={<VulnerabilityIndex />}/>
            <Route  path="/compliance-type" element={<ComplianceType />}/>

            {/* Pentest Management */}
            <Route  path="/in-progress" element={<InProgressIndex />}/>
            <Route  path="/in-progress/:id" element={<FindingIndex />}/>

            {/* Team Management */}
            <Route  path="/teams" element={<TeamGroup />}/>
            <Route  path="/employee" element={<EmployeeIndex />}/>
            
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
