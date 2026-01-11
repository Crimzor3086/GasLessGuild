import { Users, ArrowUpRight, Trash2, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGuildInfo, useGuildFactory, useMemberReputation } from "@/hooks/useGuilds";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GuildCardProps {
  guildAddress: Address;
  onClick: (address: Address) => void;
  index: number;
}

export function GuildCard({ guildAddress, onClick, index }: GuildCardProps) {
  const { guildInfo, isLoading } = useGuildInfo(guildAddress);
  const { address } = useAccount();
  const { removeGuild, isPending: isRemoving, isSuccess: isRemoved } = useGuildFactory();
  const { reputation: guildReputation, isLoading: isLoadingRep } = useMemberReputation(guildAddress, address);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isMaster = guildInfo?.master?.toLowerCase() === address?.toLowerCase();

  // Handle successful removal
  useEffect(() => {
    if (isRemoved && deleteDialogOpen) {
      toast({
        title: "Guild removed",
        description: "The guild has been successfully removed.",
      });
      setDeleteDialogOpen(false);
    }
  }, [isRemoved, deleteDialogOpen]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // Double-check that user is the master before attempting transaction
    if (!address || !isMaster) {
      toast({
        title: "Permission Denied",
        description: "Only the guild master can remove this guild.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await removeGuild(guildAddress);
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || '';
      const errorCode = error?.code;
      
      if (errorCode === 4001 || errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
        return; // User cancelled
      }
      
      // Check for gas estimation errors (extremely high gas fees usually indicate this)
      if (errorMessage.includes('gas') || errorMessage.includes('estimation') || errorCode === -32000 || errorMessage.includes('revert')) {
        toast({
          title: "Transaction Would Revert",
          description: "The transaction cannot be executed. This usually means the contracts need to be re-deployed with the updated removeMinter functions that allow the factory to revoke minter permissions. Please check the deployment notes.",
          variant: "destructive",
        });
        return;
      }
      
      if (errorMessage.includes('failed to fetch') || errorCode === -32603) {
        toast({
          title: "Network Error",
          description: "Unable to remove guild. Please check your connection and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Show the actual error message if it's helpful
      toast({
        title: "Error removing guild",
        description: error?.message || "Failed to remove guild. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !guildInfo) {
    return (
      <Card variant="glass" className="animate-fade-in-up">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { name, category, memberCount, address: guildAddr } = guildInfo;
  const firstLetter = name[0] || "G";

  return (
    <Card
      variant="glass"
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
      onClick={() => onClick(guildAddr)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{firstLetter}</span>
            </div>
            <div>
              <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                {name}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="glow">
              {category}
            </Badge>
            {isMaster && (
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Guild</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this guild? This action cannot be undone. The guild will be removed from the factory, but the contract will remain on-chain.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isRemoving}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        "Remove Guild"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                {memberCount} members
              </span>
              {address && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Coins className="w-4 h-4" />
                  {isLoadingRep ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    `${guildReputation.toLocaleString()} REP`
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

