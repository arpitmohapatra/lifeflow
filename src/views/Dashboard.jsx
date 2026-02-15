import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Circle,
    TrendingUp,
    Clock,
    Calendar,
    Target
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { getAll, STORES } from '../utils/db';
import { isToday, formatTime } from '../utils/date';

export function Dashboard({ onNavigate }) {
    const [todayTasks, setTodayTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [stats, setStats] = useState({ completed: 0, total: 0, streak: 0 });

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        const tasks = await getAll(STORES.TASKS);
        const allHabits = await getAll(STORES.HABITS);
        const events = await getAll(STORES.EVENTS);

        const today = tasks.filter(t => !t.completed && (!t.dueDate || isToday(t.dueDate)));
        const todayEvents = events.filter(e => isToday(e.date));

        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;

        // Calculate max streak from habits
        const maxHabitStreak = allHabits.length > 0
            ? Math.max(...allHabits.map(h => h.streak || 0))
            : 0;

        setTodayTasks(today.slice(0, 5));
        setHabits(allHabits.slice(0, 4));
        setTodayEvents(todayEvents.slice(0, 3));
        setStats({ completed, total, streak: maxHabitStreak });
    }

    return (
        <div className="space-y-8 w-full">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Good {getGreeting()}!</h1>
                <p className="text-text-secondary">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card elevated className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-primary/10">
                        <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{stats.completed}/{stats.total}</p>
                        <p className="text-sm text-text-secondary">Tasks Done</p>
                    </div>
                </Card>

                <Card elevated className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-success/10">
                        <TrendingUp className="w-8 h-8 text-success" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{stats.streak}</p>
                        <p className="text-sm text-text-secondary">Streak Days</p>
                    </div>
                </Card>

                <Card elevated className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-secondary/10">
                        <Calendar className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{todayEvents.length}</p>
                        <p className="text-sm text-text-secondary">Events Today</p>
                    </div>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Tasks */}
                <Card className="flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Today's Tasks</h2>
                        <button
                            onClick={() => onNavigate('tasks')}
                            className="text-sm font-semibold text-primary hover:opacity-80 cursor-pointer"
                        >
                            View all
                        </button>
                    </div>
                    <div className="space-y-3">
                        {todayTasks.length === 0 ? (
                            <p className="text-center py-10 text-text-muted">
                                No tasks for today
                            </p>
                        ) : (
                            todayTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-transparent hover:border-border hover:bg-background transition-all"
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="w-6 h-6 text-success" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-text-muted" />
                                    )}
                                    <span className="flex-1 font-medium">{task.title}</span>
                                    {task.priority && (
                                        <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}>
                                            {task.priority}
                                        </Badge>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Habits */}
                <Card className="flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Habits</h2>
                        <button
                            onClick={() => onNavigate('habits')}
                            className="text-sm font-semibold text-primary hover:opacity-80 cursor-pointer"
                        >
                            View all
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {habits.length === 0 ? (
                            <p className="text-center py-10 text-text-muted">No habits tracked yet</p>
                        ) : (
                            habits.map((habit) => (
                                <div
                                    key={habit.id}
                                    className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between"
                                >
                                    <div>
                                        <span className="font-bold block">{habit.name}</span>
                                        <span className="text-xs text-text-secondary uppercase tracking-wider">{habit.type}</span>
                                    </div>
                                    <Badge variant={habit.type === 'good' ? 'success' : 'error'}>
                                        {habit.streak || 0}d streak
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}
