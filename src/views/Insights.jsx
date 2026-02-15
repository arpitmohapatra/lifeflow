import { useState, useMemo } from 'react';
import {
    BarChart3,
    TrendingUp,
    CheckCircle2,
    Calendar,
    Clock,
    Target,
    Zap,
    Flame,
    PieChart
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';

export function Insights() {
    const { data: tasks } = useDB(STORES.TASKS);
    const { data: habits } = useDB(STORES.HABITS);
    const { data: pomodoros } = useDB(STORES.POMODOROS);

    const stats = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Habit stats
        const avgStreak = habits.length > 0
            ? habits.reduce((acc, h) => acc + (h.streak || 0), 0) / habits.length
            : 0;

        // Task distribution by priority
        const priorities = {
            high: tasks.filter(t => t.priority === 'high').length,
            medium: tasks.filter(t => t.priority === 'medium').length,
            low: tasks.filter(t => t.priority === 'low').length,
        };

        // Tasks completed in last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const count = tasks.filter(t => t.completed && t.updatedAt && new Date(t.updatedAt).toDateString() === dateStr).length;
            return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), count };
        }).reverse();

        return {
            completedTasks,
            totalTasks,
            completionRate,
            avgStreak,
            priorities,
            last7Days,
            totalFocusTime: pomodoros.length * 25 // Assuming 25min each
        };
    }, [tasks, habits, pomodoros]);

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Insights</h1>
                <Badge variant="primary" className="py-2 px-4 text-xs font-black uppercase tracking-widest">
                    Last 7 Days
                </Badge>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card elevated className="bg-primary/5 border-primary/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{Math.round(stats.completionRate)}%</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Completion Rate</p>
                        </div>
                    </div>
                </Card>

                <Card elevated className="bg-success/5 border-success/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-success text-white shadow-lg shadow-success/20">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{stats.completedTasks}</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Tasks Done</p>
                        </div>
                    </div>
                </Card>

                <Card elevated className="bg-warning/5 border-warning/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-warning text-white shadow-lg shadow-warning/20">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{stats.avgStreak.toFixed(1)}</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Avg Habit Streak</p>
                        </div>
                    </div>
                </Card>

                <Card elevated className="bg-secondary/5 border-secondary/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-secondary text-white shadow-lg shadow-secondary/20">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{Math.round(stats.totalFocusTime / 60)}h</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Focus</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Productivity Chart */}
                <Card className="lg:col-span-2 p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Daily Productivity
                            </h3>
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">Tasks completed per day</p>
                        </div>
                        <Zap className="w-5 h-5 text-primary animate-pulse" />
                    </div>

                    <div className="flex items-end justify-between h-48 gap-4 px-4">
                        {stats.last7Days.map((d, i) => {
                            const maxCount = Math.max(...stats.last7Days.map(x => x.count), 1);
                            const height = (d.count / maxCount) * 100;

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="relative w-full flex-1">
                                        <div
                                            className="absolute bottom-0 w-full bg-primary/20 rounded-t-xl transition-all duration-1000 group-hover:bg-primary/40 border-t border-primary/30"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-border px-2 py-0.5 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                {d.count}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">{d.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Priority Breakdown */}
                <Card className="p-8">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-secondary" />
                        Task Load
                    </h3>

                    <div className="space-y-6">
                        {[
                            { label: 'High Priority', value: stats.priorities.high, color: 'bg-error', total: stats.totalTasks },
                            { label: 'Medium Priority', value: stats.priorities.medium, color: 'bg-warning', total: stats.totalTasks },
                            { label: 'Low Priority', value: stats.priorities.low, color: 'bg-primary', total: stats.totalTasks },
                        ].map((p, i) => {
                            const percentage = p.total > 0 ? (p.value / p.total) * 100 : 0;
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                        <span className="text-text-secondary">{p.label}</span>
                                        <span className="text-text">{p.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden border border-border/50">
                                        <div
                                            className={`h-full ${p.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 p-4 rounded-2xl bg-secondary/5 border border-secondary/20">
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-secondary" />
                            <p className="text-xs text-text-secondary leading-relaxed font-medium">
                                Small tip: Breaking down 1 high-priority task into 3 smaller ones can help maintain momentum.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
