import { Users, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useGuildInfo } from "@/hooks/useGuilds";
import { Address } from "viem";

interface GuildCardProps {
  guildAddress: Address;
  onClick: (address: Address) => void;
  index: number;
}

export function GuildCard({ guildAddress, onClick, index }: GuildCardProps) {
  const { guildInfo, isLoading } = useGuildInfo(guildAddress);

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
          <Badge variant="glow">
            {category}
          </Badge>
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

