import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ProfileData } from "@/hooks/useProfile";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProfileData) => void;
  initialData?: ProfileData;
}

export function EditProfileDialog({ open, onOpenChange, onSave, initialData }: EditProfileDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    displayName: "",
    bio: "",
    twitter: "",
    discord: "",
    website: "",
  });

  // Load initial data when dialog opens
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate Twitter handle format
      if (formData.twitter && !formData.twitter.startsWith('@')) {
        formData.twitter = '@' + formData.twitter.replace(/^@+/, '');
      }

      onSave(formData);
      toast({
        title: "Profile updated!",
        description: "Your profile has been saved successfully.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error?.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. This will be stored locally and can be upgraded to on-chain storage later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Enter your display name"
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                disabled={isSaving}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                How you want to be known in the GasLess Guilds community
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={isSaving}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="twitter">Twitter/X</Label>
              <Input
                id="twitter"
                placeholder="@username"
                value={formData.twitter}
                onChange={(e) => {
                  let value = e.target.value;
                  // Auto-add @ if user types without it
                  if (value && !value.startsWith('@')) {
                    value = '@' + value;
                  }
                  handleChange("twitter", value);
                }}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Your Twitter/X username (e.g., @yourname)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                placeholder="username#1234"
                value={formData.discord}
                onChange={(e) => handleChange("discord", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                type="url"
                value={formData.website}
                onChange={(e) => {
                  let value = e.target.value;
                  // Auto-add https:// if user types without protocol
                  if (value && !value.match(/^https?:\/\//i)) {
                    value = 'https://' + value;
                  }
                  handleChange("website", value);
                }}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Your personal website or portfolio
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

