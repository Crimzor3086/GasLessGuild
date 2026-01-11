import { useState, useEffect } from "react";
import { useGuild, useGuildInfo } from "@/hooks/useGuilds";
import { useAccount } from "wagmi";
import { Address } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface CreateTaskDialogProps {
  guildAddress: Address;
  onSuccess?: () => void;
}

export function CreateTaskDialog({ guildAddress, onSuccess }: CreateTaskDialogProps) {
  const { isConnected, address } = useAccount();
  const { createTask, isPending, isSuccess, isError, error } = useGuild(guildAddress);
  const { guildInfo } = useGuildInfo(guildAddress);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardNFT, setRewardNFT] = useState(false);

  const isMaster = guildInfo?.master?.toLowerCase() === address?.toLowerCase();

  // Show success toast and close dialog when transaction is confirmed
  useEffect(() => {
    if (isSuccess && open) {
      toast({
        title: "Task created!",
        description: "Your task has been created successfully.",
      });
      setTitle("");
      setDescription("");
      setRewardPoints("");
      setRewardNFT(false);
      setOpen(false);
      onSuccess?.();
    }
  }, [isSuccess, open, onSuccess]);

  // Show error toast if transaction fails after submission
  useEffect(() => {
    if (isError && error && open) {
      const errorMessage = error?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('reverted') || errorMessage.includes('revert')) {
        toast({
          title: "Transaction Failed",
          description: error.message || "The transaction was reverted on-chain. Please verify you are the guild master and try again.",
          variant: "destructive",
        });
      } else if (!errorMessage.includes('user rejected') && !errorMessage.includes('user denied')) {
        toast({
          title: "Transaction Error",
          description: error.message || "The transaction failed. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [isError, error, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a task.",
        variant: "destructive",
      });
      return;
    }

    if (!isMaster) {
      toast({
        title: "Permission Denied",
        description: "Only the guild master can create tasks.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !rewardPoints) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const points = parseInt(rewardPoints);
    if (isNaN(points) || points < 0) {
      toast({
        title: "Invalid reward points",
        description: "Reward points must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const hash = await createTask(title, description, BigInt(points), rewardNFT);
      if (hash) {
        // Transaction submitted - wait for confirmation
        // Success will be handled by useEffect
      }
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || '';
      const errorCode = error?.code;
      
      // Handle user rejection silently
      if (errorCode === 4001 || errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
        return; // User cancelled
      }
      
      // Check if error message already contains helpful information
      if (error?.message && (
        error.message.includes('guild master') ||
        error.message.includes('permission') ||
        error.message.includes('owner') ||
        error.message.includes('would revert')
      )) {
        toast({
          title: "Permission Denied",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Handle network errors (but not contract revert "Failed to fetch")
      if ((errorMessage.includes('failed to fetch') && !errorMessage.includes('contract')) || errorCode === -32603) {
        toast({
          title: "Network Error",
          description: "Unable to submit transaction. Please check your connection and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Handle contract revert errors
      if (errorMessage.includes('failed to fetch') || errorMessage.includes('revert') || errorMessage.includes('reverted')) {
        toast({
          title: "Transaction Failed",
          description: error?.message || "The transaction would revert. Please verify you are the guild master and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Handle other errors
      toast({
        title: "Error creating task",
        description: error?.message || "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isMaster) {
    return null; // Don't show create button if not master
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="default" className="gap-2">
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task for your guild members to complete and earn rewards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Complete onboarding tutorial"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what members need to do to complete this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                rows={4}
                maxLength={500}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rewardPoints">Reward Points (REP) *</Label>
              <Input
                id="rewardPoints"
                type="number"
                placeholder="e.g., 100"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                disabled={isPending}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Amount of REP tokens to award upon task completion
              </p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="rewardNFT" className="text-base">Award NFT Badge</Label>
                <p className="text-sm text-muted-foreground">
                  Give members an NFT badge when they complete this task
                </p>
              </div>
              <Switch
                id="rewardNFT"
                checked={rewardNFT}
                onCheckedChange={setRewardNFT}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !isConnected || !isMaster}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

