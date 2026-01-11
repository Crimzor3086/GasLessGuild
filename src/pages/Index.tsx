import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GuildDashboard from "@/components/GuildDashboard";
import TaskView from "@/components/TaskView";
import ProfilePage from "@/components/ProfilePage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {currentPage === "home" && <HeroSection onNavigate={handleNavigate} />}
      {currentPage === "dashboard" && <GuildDashboard onNavigate={handleNavigate} />}
      {currentPage === "tasks" && <TaskView />}
      {currentPage === "profile" && <ProfilePage />}
    </div>
  );
};

export default Index;
