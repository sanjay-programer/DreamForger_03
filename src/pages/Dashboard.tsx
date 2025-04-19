import { useEffect, useState } from 'react';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { BarChart, Activity, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Skill {
  id: number;
  name: string;
}

const Dashboard = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const { userId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/generate-skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dream: "Doctor" // This should be fetched from user's profile
          }),
        });

        const data = await response.json();

        if (data.response && data.response.skills) {
          setSkills(data.response.skills);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch skills",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching skills",
          variant: "destructive",
        });
      }
    };

    fetchSkills();
  }, [userId, toast]);

  // Sample data
  const stats = [
    { label: "Learning Streaks", value: "12 days", icon: Activity, color: "neon-cyan" },
    { label: "XP Gained", value: "4,780", icon: BarChart, color: "neon-magenta" },
    { label: "Time Invested", value: "27 hours", icon: BarChart, color: "neon-green" }
  ];

  const achievements = [
    { name: "First Step", description: "Complete your first mission", unlocked: true },
    { name: "Consistency", description: "Maintain a 7-day streak", unlocked: true },
    { name: "Quick Learner", description: "Complete 10 missions", unlocked: true },
    { name: "Expert", description: "Reach Level 10", unlocked: false },
    { name: "Mastery", description: "Complete your dream roadmap", unlocked: false }
  ];

  return (
    <div className="min-h-screen">
      <Starscape />
      <Sidebar />

      <main className="pl-[240px] p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold neon-text-cyan mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your progress and achievements</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={cn(
                  "glassmorphism p-6 rounded-lg",
                  stat.color === "neon-cyan" ? "neon-border-cyan" : 
                  stat.color === "neon-magenta" ? "neon-border-magenta" : "neon-border-green"
                )}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{stat.label}</h3>
                  <Icon className={cn(
                    "w-6 h-6",
                    stat.color === "neon-cyan" ? "text-neon-cyan" : 
                    stat.color === "neon-magenta" ? "text-neon-magenta" : "text-neon-green"
                  )} />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Skills and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Section */}
          <div className="glassmorphism-dark p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6 neon-text-cyan">Skills Gained</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{skill.name}</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-neon-cyan"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="glassmorphism-dark p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6 neon-text-magenta">Achievements</h2>
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-4 rounded-lg border flex items-start space-x-3",
                    achievement.unlocked 
                      ? "border-neon-green bg-neon-green/10"
                      : "border-white/10 bg-white/5 opacity-60"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    achievement.unlocked ? "bg-neon-green" : "bg-white/10"
                  )}>
                    <Award className={cn(
                      "w-5 h-5",
                      achievement.unlocked ? "text-black" : "text-white/60"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-sm opacity-80">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
