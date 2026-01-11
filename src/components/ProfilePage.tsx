import { Copy, ExternalLink, Award, Star, Zap, Shield, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const badges = [
  { id: 1, name: "Early Adopter", icon: Star, rarity: "Legendary", earned: "Dec 2024" },
  { id: 2, name: "Task Master", icon: Zap, rarity: "Epic", earned: "Jan 2025" },
  { id: 3, name: "Guild Leader", icon: Crown, rarity: "Rare", earned: "Jan 2025" },
  { id: 4, name: "Defender", icon: Shield, rarity: "Common", earned: "Jan 2025" },
];

const activityHistory = [
  { id: 1, action: "Completed task", details: "Weekly governance vote", reward: "+100 REP", time: "2 hours ago" },
  { id: 2, action: "Earned badge", details: "Task Master NFT", reward: "NFT", time: "1 day ago" },
  { id: 3, action: "Joined guild", details: "DeFi Dragons", reward: "+50 REP", time: "3 days ago" },
  { id: 4, action: "Referred member", details: "0x7a3...f9c2", reward: "+75 REP", time: "5 days ago" },
  { id: 5, action: "Completed task", details: "Onboarding survey", reward: "+50 REP", time: "1 week ago" },
];

const rarityColors = {
  Legendary: "from-amber-400 to-orange-500",
  Epic: "from-purple-400 to-pink-500",
  Rare: "from-primary to-secondary",
  Common: "from-muted-foreground to-muted-foreground",
};

const ProfilePage = () => {
  const walletAddress = "0x1a2b...3c4d";
  const fullAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcd3c4d";

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
  };

  return (
    <section className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Profile Header */}
        <Card variant="glow" className="mb-8 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-glow-strong">
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                  <span className="text-3xl font-bold gradient-text">GG</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">GasLess Guild Member</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <code className="text-sm">{walletAddress}</code>
                  <button onClick={copyAddress} className="hover:text-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href="#" className="hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">2,450</p>
                  <p className="text-sm text-muted-foreground">Total REP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">NFT Badges</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">23</p>
                  <p className="text-sm text-muted-foreground">Tasks Done</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Badges */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                NFT Badges
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {badges.map((badge, index) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <Card
                      key={badge.id}
                      variant="glass"
                      className="group cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity as keyof typeof rarityColors]} p-0.5 group-hover:shadow-glow transition-shadow`}>
                            <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                              <BadgeIcon className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{badge.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="gradient" className="text-xs">
                                {badge.rarity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{badge.earned}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Level Progress */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Level 12</span>
                    <span className="text-sm text-muted-foreground">2,450 / 3,000 REP</span>
                  </div>
                  <Progress value={82} indicatorVariant="glow" className="h-3" />
                  <p className="text-sm text-muted-foreground">550 REP until Level 13</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Activity History</h2>
            <Card variant="glass">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {activityHistory.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-sm">{activity.action}</span>
                        <Badge variant="glow" className="text-xs">
                          {activity.reward}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full mt-4">
              View Full History
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
