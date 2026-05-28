import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [dashboardData, setDashboardData] = useState({
    trustScore: 0,
    riskLevel: "LOW",
    behavioralData: null,
  });

  function handleLoginSuccess(loginData) {
    setDashboardData(loginData);
    setCurrentPage("dashboard");
  }

  function handleBackToLogin() {
    setCurrentPage("login");
  }

  if (currentPage === "dashboard") {
    return (
      <Dashboard
        trustScore={dashboardData.trustScore}
        riskLevel={dashboardData.riskLevel}
        behavioralData={dashboardData.behavioralData}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;