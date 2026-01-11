import { Clock, CheckCircle2, Circle, Gift, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tasks = [
  {
    id: 1,
    title: "Complete onboarding survey",
    description: "Help us improve by sharing your feedback",
    reward: "50 REP",
    status: "completed",
    difficulty: "Easy",
    timeEstimate: "5 min",
  },
  {
    id: 2,
    title: "Refer 3 new members",
    description: "Invite friends to join your guild",
    reward: "200 REP + NFT Badge",
    status: "in-progress",
    difficulty: "Medium",
    timeEstimate: "Ongoing",
  },
  {
    id: 3,
    title: "Participate in governance vote",
    description: "Cast your vote on the latest proposal",
    reward: "100 REP",
    status: "pending",
    difficulty: "Easy",
    timeEstimate: "2 min",
  },
  {
    id: 4,
    title: "Create community content",
    description: "Write a tutorial or guide for newcomers",
    reward: "500 REP + 0.01 ETH",
    status: "pending",
    difficulty: "Hard",
    timeEstimate: "1-2 hours",
  },
  {
    id: 5,
    title: "Complete weekly challenge",
    description: "Finish all daily tasks for 7 consecutive days",
    reward: "1000 REP + Rare NFT",
    status: "in-progress",
    difficulty: "Hard",
    timeEstimate: "7 days",
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Completed" },
  "in-progress": { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "In Progress" },
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
};

const difficultyConfig = {
  Easy: "success",
  Medium: "warning",
  Hard: "destructive",
} as const;

const TaskView = () => {
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
              <p className="text-2xl font-bold text-emerald-400">12</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">3</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">8</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </Card>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const status = statusConfig[task.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <Card
                key={task.id}
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={difficultyConfig[task.difficulty as keyof typeof difficultyConfig]}>
                            {task.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {task.timeEstimate}
                          </span>
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Gift className="w-4 h-4" />
                            {task.reward}
                          </span>
                        </div>

                        {task.status === "pending" && (
                          <Button variant="default" size="sm" className="gap-1">
                            Start Task
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === "in-progress" && (
                          <Button variant="outline" size="sm">
                            Continue
                          </Button>
                        )}
                        {task.status === "completed" && (
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
          })}
        </div>
      </div>
    </section>
  );
};

export default TaskView;
