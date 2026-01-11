import { Users, Trophy, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAllGuilds } from "@/hooks/useGuilds";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { CreateGuildDialog } from "./CreateGuildDialog";
import { GuildCard } from "./GuildCard";
import { useState } from "react";

interface GuildDashboardProps {
  onNavigate: (page: string, guildAddress?: Address) => void;
}

const GuildDashboard = ({ onNavigate }: GuildDashboardProps) => {
  const { address } = useAccount();
  const { guildAddresses, isLoading: isLoadingGuilds } = useAllGuilds();
  const [selectedGuild, setSelectedGuild] = useState<Address | undefined>(undefined);

  const stats = [
    { 
      label: "Total Guilds", 
      value: guildAddresses.length.toString(), 
      icon: Users, 
      change: `${guildAddresses.length} active` 
    },
    { 
      label: "Tasks Completed", 
      value: "—", 
      icon: CheckCircle, 
      change: "Coming soon" 
    },
    { 
      label: "Rewards Distributed", 
      value: "—", 
      icon: Trophy, 
      change: "Coming soon" 
    },
  ];

  const handleGuildClick = (guildAddress: Address) => {
    setSelectedGuild(guildAddress);
    onNavigate("tasks", guildAddress);
  };

  if (isLoadingGuilds) {
    return (
      <section className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guild Dashboard</h1>
          <p className="text-muted-foreground">Manage your guilds and track community progress</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              variant="glass"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-xs text-emerald-400 mt-2">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guild Cards */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">All Guilds</h2>
          <CreateGuildDialog />
        </div>

        {guildAddresses.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">No guilds found. Create the first one!</p>
              <CreateGuildDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {guildAddresses.map((guildAddress, index) => (
              <GuildCard
                key={guildAddress}
                guildAddress={guildAddress}
                onClick={handleGuildClick}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GuildDashboard;
