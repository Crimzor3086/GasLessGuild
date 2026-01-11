import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GuildDashboard from "@/components/GuildDashboard";
import TaskView from "@/components/TaskView";
import ProfilePage from "@/components/ProfilePage";
import { Address } from "viem";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedGuild, setSelectedGuild] = useState<Address | undefined>(undefined);

  const handleNavigate = (page: string, guildAddress?: Address) => {
    setCurrentPage(page);
    if (guildAddress) {
      setSelectedGuild(guildAddress);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={(page) => handleNavigate(page)} currentPage={currentPage} />
      
      {currentPage === "home" && <HeroSection onNavigate={handleNavigate} />}
      {currentPage === "dashboard" && <GuildDashboard onNavigate={handleNavigate} />}
      {currentPage === "tasks" && <TaskView guildAddress={selectedGuild} />}
      {currentPage === "profile" && <ProfilePage />}
    </div>
  );
};

export default Index;
