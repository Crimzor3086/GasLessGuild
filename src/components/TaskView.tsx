import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGuild, useGuildTasks } from "@/hooks/useGuilds";
import { Address } from "viem";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { TaskCard } from "./TaskCard";

interface TaskViewProps {
  guildAddress?: Address;
}

const TaskView = ({ guildAddress }: TaskViewProps) => {
  const { taskCount, isLoading: isLoadingTasks } = useGuildTasks(guildAddress);
  const { completeTask, isPending: isCompleting } = useGuild(guildAddress);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const handleCompleteTask = async (taskId: number) => {
    if (!guildAddress) {
      toast({
        title: "No guild selected",
        description: "Please select a guild first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await completeTask(BigInt(taskId));
      setCompletedTasks((prev) => new Set([...prev, taskId]));
      toast({
        title: "Task completed!",
        description: "You've earned your rewards.",
      });
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
        title: "Error completing task",
        description: error?.message || "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!guildAddress) {
    return (
      <section className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <Card variant="glass" className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">No guild selected. Please select a guild from the dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isLoadingTasks) {
    return (
      <section className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const taskIds = Array.from({ length: taskCount }, (_, i) => i + 1);

  return (
    <section className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">Complete tasks to earn rewards and build your reputation</p>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card variant="glass" className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{completedTasks.size}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">{taskCount - completedTasks.size}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{taskCount}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </Card>
        </div>

        {/* Task List */}
        {taskCount === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">No tasks available in this guild yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {taskIds.map((taskId, index) => (
              <TaskCard
                key={taskId}
                guildAddress={guildAddress!}
                taskId={taskId}
                index={index}
                onComplete={handleCompleteTask}
                isCompleting={isCompleting}
                isCompleted={completedTasks.has(taskId)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskView;
