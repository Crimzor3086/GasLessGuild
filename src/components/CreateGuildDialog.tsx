import { useState, useEffect } from "react";
import { useGuildFactory } from "@/hooks/useGuilds";
import { useAccount } from "wagmi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreateGuildDialogProps {
  onSuccess?: () => void;
}

export function CreateGuildDialog({ onSuccess }: CreateGuildDialogProps) {
  const { isConnected } = useAccount();
  const { createGuild, isPending, isSuccess } = useGuildFactory();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a guild.",
        variant: "destructive",
      });
      return;
    }

    if (!name || !description || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const hash = await createGuild(name, description, category);
      // Wait for transaction confirmation
      if (hash) {
        // Transaction submitted successfully - wait for confirmation
        // The success toast will be shown when isSuccess becomes true
        setName("");
        setDescription("");
        setCategory("");
      }
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || '';
      const errorCode = error?.code;
      
      // Handle user rejection silently
      if (errorCode === 4001 || errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
        // User cancelled - don't show error
        return;
      }
      
      // Handle network errors
      if (errorMessage.includes('failed to fetch') || errorCode === -32603) {
        toast({
          title: "Network Error",
          description: "Unable to submit transaction. Please check your connection and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Handle other errors
      toast({
        title: "Error creating guild",
        description: error?.message || "Failed to create guild. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show success toast and close dialog when transaction is confirmed
  useEffect(() => {
    if (isSuccess && open) {
      toast({
        title: "Guild created!",
        description: "Your guild has been created successfully.",
      });
      setOpen(false);
      onSuccess?.();
    }
  }, [isSuccess, open, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="default">
          Create Guild
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Guild</DialogTitle>
          <DialogDescription>
            Create a new guild to start rewarding your community members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Guild Name</Label>
              <Input
                id="name"
                placeholder="e.g., DeFi Dragons"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your guild's purpose and goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DeFi">DeFi</SelectItem>
                  <SelectItem value="NFT">NFT</SelectItem>
                  <SelectItem value="Governance">Governance</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={isPending || !isConnected}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Guild
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

