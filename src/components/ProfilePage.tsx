import { Copy, ExternalLink, Award, Check, Edit, Twitter, Globe, MessageSquare } from "lucide-react";
import { Logo } from "./Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAccount } from "wagmi";
import { useRewardTokenBalance, useRewardNFTs } from "@/hooks/useRewards";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { EditProfileDialog } from "./EditProfileDialog";
import { useProfile } from "@/hooks/useProfile";

const rarityColors = {
  Legendary: "from-amber-400 to-orange-500",
  Epic: "from-purple-400 to-pink-500",
  Rare: "from-primary to-secondary",
  Common: "from-muted-foreground to-muted-foreground",
};

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const { balance: reputationPoints, isLoading: isLoadingRep } = useRewardTokenBalance();
  const { tokenIds: nftTokenIds, isLoading: isLoadingNFTs } = useRewardNFTs();
  const { profileData, saveProfile } = useProfile();
  const [copied, setCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleSaveProfile = (data: typeof profileData) => {
    saveProfile(data);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const getExplorerUrl = (addr: string) => {
    return `https://arbiscan.io/address/${addr}`;
  };

  if (!isConnected || !address) {
    return (
      <section className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <Card variant="glass" className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">Please connect your wallet to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const walletAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const nftCount = nftTokenIds.length;
  const level = Math.floor(reputationPoints / 250); // 250 REP per level
  const levelProgress = (reputationPoints % 250) / 250 * 100;

  return (
    <section className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Profile Header */}
        <Card variant="glow" className="mb-8 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-glow-strong flex items-center justify-center">
                <Logo size={80} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">
                    {profileData.displayName || "GasLess Guild Member"}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                {profileData.bio && (
                  <p className="text-sm text-muted-foreground mb-2 max-w-2xl">
                    {profileData.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <code className="text-sm">{walletAddress}</code>
                    <button onClick={copyAddress} className="hover:text-primary transition-colors">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={getExplorerUrl(address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  {profileData.twitter && (
                    <a
                      href={`https://twitter.com/${profileData.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      {profileData.twitter}
                    </a>
                  )}
                  {profileData.discord && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      {profileData.discord}
                    </div>
                  )}
                  {profileData.website && (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">
                    {isLoadingRep ? "—" : reputationPoints.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total REP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {isLoadingNFTs ? "—" : nftCount}
                  </p>
                  <p className="text-sm text-muted-foreground">NFT Badges</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{level}</p>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Badges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            {(profileData.displayName || profileData.bio || profileData.twitter || profileData.discord || profileData.website) && (
              <Card variant="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialogOpen(true)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.bio && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bio</p>
                      <p className="text-sm">{profileData.bio}</p>
                    </div>
                  )}
                  {(profileData.twitter || profileData.discord || profileData.website) && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Social Links</p>
                      <div className="flex flex-wrap gap-3">
                        {profileData.twitter && (
                          <a
                            href={`https://twitter.com/${profileData.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                          >
                            <Twitter className="w-4 h-4" />
                            {profileData.twitter}
                          </a>
                        )}
                        {profileData.discord && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
                            <MessageSquare className="w-4 h-4" />
                            {profileData.discord}
                          </div>
                        )}
                        {profileData.website && (
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Edit Profile Prompt */}
            {!profileData.displayName && !profileData.bio && (
              <Card variant="glass" className="border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Customize your profile to stand out in the GasLess Guilds community!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(true)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                NFT Badges
              </h2>
              {isLoadingNFTs ? (
                <Card variant="glass" className="p-12 text-center">
                  <CardContent>
                    <p className="text-muted-foreground">Loading badges...</p>
                  </CardContent>
                </Card>
              ) : nftTokenIds.length === 0 ? (
                <Card variant="glass" className="p-12 text-center">
                  <CardContent>
                    <p className="text-muted-foreground">No badges yet. Complete tasks to earn NFT badges!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {nftTokenIds.map((tokenId, index) => (
                    <Card
                      key={tokenId}
                      variant="glass"
                      className="group cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rarityColors.Rare} p-0.5 group-hover:shadow-glow transition-shadow`}>
                            <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                              <Award className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">Badge #{tokenId}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="gradient" className="text-xs">
                                NFT
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Level Progress */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Level {level}</span>
                    <span className="text-sm text-muted-foreground">
                      {reputationPoints} / {(level + 1) * 250} REP
                    </span>
                  </div>
                  <Progress value={levelProgress} indicatorVariant="glow" className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {Math.max(0, (level + 1) * 250 - reputationPoints)} REP until Level {level + 1}
                  </p>
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
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">Activity history coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveProfile}
        initialData={profileData}
      />
    </section>
  );
};

export default ProfilePage;
