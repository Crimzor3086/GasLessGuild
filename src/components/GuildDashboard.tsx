import { Users, Trophy, CheckCircle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface GuildDashboardProps {
  onNavigate: (page: string) => void;
}

const guilds = [
  {
    id: 1,
    name: "DeFi Dragons",
    members: 234,
    tasksCompleted: 1847,
    reputation: 9850,
    progress: 78,
    category: "DeFi",
    active: true,
  },
  {
    id: 2,
    name: "NFT Ninjas",
    members: 189,
    tasksCompleted: 1234,
    reputation: 7420,
    progress: 65,
    category: "NFT",
    active: true,
  },
  {
    id: 3,
    name: "DAO Defenders",
    members: 312,
    tasksCompleted: 2156,
    reputation: 12300,
    progress: 92,
    category: "Governance",
    active: true,
  },
  {
    id: 4,
    name: "Bridge Builders",
    members: 156,
    tasksCompleted: 892,
    reputation: 5670,
    progress: 45,
    category: "Infrastructure",
    active: false,
  },
];

const stats = [
  { label: "Total Guilds", value: "24", icon: Users, change: "+3 this week" },
  { label: "Tasks Completed", value: "12.4K", icon: CheckCircle, change: "+847 today" },
  { label: "Rewards Distributed", value: "45.2 ETH", icon: Trophy, change: "+2.1 ETH" },
];

const GuildDashboard = ({ onNavigate }: GuildDashboardProps) => {
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
          <h2 className="text-xl font-semibold">Your Guilds</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guilds.map((guild, index) => (
            <Card
              key={guild.id}
              variant="glass"
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              onClick={() => onNavigate("tasks")}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{guild.name[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        {guild.name}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{guild.members} members</CardDescription>
                    </div>
                  </div>
                  <Badge variant={guild.active ? "glow" : "outline"}>
                    {guild.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Season Progress</span>
                    <span className="font-medium">{guild.progress}%</span>
                  </div>
                  <Progress value={guild.progress} indicatorVariant="glow" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {guild.tasksCompleted.toLocaleString()} tasks
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        {guild.reputation.toLocaleString()} rep
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuildDashboard;
