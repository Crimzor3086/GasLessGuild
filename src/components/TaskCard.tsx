import { CheckCircle2, Circle, Gift, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTask } from "@/hooks/useGuilds";
import { useAccount } from "wagmi";
import { Address } from "viem";

interface TaskCardProps {
  guildAddress: Address;
  taskId: number;
  index: number;
  onComplete: (taskId: number) => void;
  isCompleting: boolean;
  isCompleted: boolean;
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Completed" },
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
};

export function TaskCard({ guildAddress, taskId, index, onComplete, isCompleting, isCompleted }: TaskCardProps) {
  const { address } = useAccount();
  const { task, isLoading } = useTask(guildAddress, taskId);

  if (isLoading || !task) {
    return (
      <Card variant="glass" className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-20">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = isCompleted ? statusConfig.completed : statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card
      variant="glass"
      className="group animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={`w-10 h-10 rounded-full ${status.bg} flex items-center justify-center flex-shrink-0`}>
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Gift className="w-4 h-4" />
                  {task.rewardPoints} REP {task.rewardNFT && "+ NFT Badge"}
                </span>
              </div>

              {!isCompleted && address && (
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1"
                  onClick={() => onComplete(taskId)}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Task
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
              {isCompleted && (
                <Badge variant="success">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Done
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

