import { Award, Coins, Image as ImageIcon, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRewardTokenBalance, useRewardNFTs } from "@/hooks/useRewards";
import { useAccount } from "wagmi";
import { Loader2 } from "lucide-react";

interface RewardsSummaryProps {
  address?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function RewardsSummary({ address, showTitle = true, compact = false }: RewardsSummaryProps) {
  const { address: accountAddress } = useAccount();
  const targetAddress = (address as `0x${string}`) || accountAddress;
  
  const { balance: repBalance, isLoading: isLoadingRep } = useRewardTokenBalance(targetAddress);
  const { tokenIds: nftTokenIds, isLoading: isLoadingNFTs } = useRewardNFTs(targetAddress);

  const nftCount = nftTokenIds.length;
  const level = Math.floor(repBalance / 250); // 250 REP per level
  const levelProgress = (repBalance % 250) / 250 * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {isLoadingRep ? "—" : repBalance.toLocaleString()} REP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">
            {isLoadingNFTs ? "—" : nftCount} Badges
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          Level {level}
        </Badge>
      </div>
    );
  }

  return (
    <Card variant="glass">
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Rewards Summary
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* REP Balance */}
          <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text mb-1">
                {isLoadingRep ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  repBalance.toLocaleString()
                )}
              </p>
              <p className="text-sm text-muted-foreground">REP Tokens</p>
            </div>
          </div>

          {/* NFT Badges */}
          <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">
                {isLoadingNFTs ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  nftCount
                )}
              </p>
              <p className="text-sm text-muted-foreground">NFT Badges</p>
            </div>
          </div>

          {/* Level */}
          <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">{level}</p>
              <p className="text-sm text-muted-foreground">Level</p>
              <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {repBalance % 250} / 250 to next level
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

