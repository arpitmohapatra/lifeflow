import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';

const DAYS = [
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 },
];

export function Habits() {
    const { data: habits, addItem, updateItem, removeItem } = useDB(STORES.HABITS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'good',
        frequency: 'daily',
        selectedDays: [0, 1, 2, 3, 4, 5, 6] // Default to all days
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addItem({
            ...formData,
            id: Date.now().toString(),
            streak: 0,
            history: [],
            created: new Date().toISOString(),
        });

        setIsModalOpen(false);
        setFormData({ name: '', type: 'good', frequency: 'daily', selectedDays: [0, 1, 2, 3, 4, 5, 6] });
    };

    const toggleDaySelection = (day) => {
        setFormData(prev => {
            const isSelected = prev.selectedDays.includes(day);
            const newDays = isSelected
                ? prev.selectedDays.filter(d => d !== day)
                : [...prev.selectedDays, day].sort();
            return { ...prev, selectedDays: newDays };
        });
    };

    const toggleToday = async (habit) => {
        const today = new Date().toDateString();
        const history = habit.history || [];
        const todayIndex = history.findIndex(h => new Date(h).toDateString() === today);

        let newHistory;
        let newStreak = habit.streak || 0;

        if (todayIndex >= 0) {
            newHistory = history.filter((_, i) => i !== todayIndex);
            newStreak = Math.max(0, newStreak - 1);
        } else {
            newHistory = [...history, new Date().toISOString()];
            newStreak = newStreak + 1;
        }

        await updateItem({
            ...habit,
            history: newHistory,
            streak: newStreak,
        });
    };

    const isCompletedToday = (habit) => {
        const today = new Date().toDateString();
        return habit.history?.some(h => new Date(h).toDateString() === today);
    };

    const isScheduledForToday = (habit) => {
        if (habit.frequency === 'daily') return true;
        if (habit.frequency === 'weekly') return true; // Could be improved if "weekly" means "once a week"
        const dayOfWeek = new Date().getDay();
        return habit.selectedDays?.includes(dayOfWeek);
    };

    const getFrequencyLabel = (habit) => {
        if (habit.frequency === 'daily') return 'Every Day';
        if (habit.frequency === 'weekly') return 'Once a Week';
        if (habit.frequency === 'custom') {
            const labels = habit.selectedDays.map(d => DAYS.find(day => day.value === d).label);
            return labels.join(', ');
        }
        return habit.frequency;
    };

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Habits</h1>
                    <p className="text-sm text-text-secondary mt-1 font-medium">Build consistency and track your progress</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    New Habit
                </Button>
            </div>

            {/* Habits List */}
            {habits.length === 0 ? (
                <EmptyState
                    icon={TrendingUp}
                    title="No habits yet"
                    description="Start tracking your daily routines and build a better lifestyle"
                    action={<Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Habit</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {habits.map((habit, index) => {
                        const scheduledToday = isScheduledForToday(habit);
                        return (
                            <Card
                                key={habit.id}
                                className={`animate-slide-up flex flex-col justify-between transition-all ${!scheduledToday ? 'opacity-60 bg-surface/50 grayscale-[0.2]' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="relative group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-xl ${habit.type === 'good' ? 'bg-success/10' : 'bg-error/10'}`}>
                                                {habit.type === 'good' ? (
                                                    <TrendingUp className={`w-8 h-8 ${habit.type === 'good' ? 'text-success' : 'text-error'}`} />
                                                ) : (
                                                    <TrendingDown className="w-8 h-8 text-error" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-text mb-1">{habit.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-text-muted font-black uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {getFrequencyLabel(habit)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge variant={habit.type === 'good' ? 'success' : 'error'} className="py-2 px-3 text-sm">
                                                {habit.streak || 0}-day streak
                                            </Badge>
                                            <button
                                                onClick={() => removeItem(habit.id)}
                                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-error/10 text-text-muted hover:text-error rounded-lg transition-all"
                                            >
                                                <Plus className="w-4 h-4 rotate-45" /> {/* Use Plus as X icon */}
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isCompletedToday(habit) ? 'bg-success/5 border-success/30' : 'bg-background/50 border-border'}`}>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-text mb-0.5">
                                                {isCompletedToday(habit) ? 'Completed today' : scheduledToday ? 'Action needed' : 'Rest day'}
                                            </span>
                                            {!scheduledToday && !isCompletedToday(habit) && (
                                                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Not scheduled for today</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleToday(habit)}
                                            className="transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            {isCompletedToday(habit) ? (
                                                <CheckCircle2 className="w-10 h-10 text-success" />
                                            ) : (
                                                <Circle className={`w-10 h-10 ${scheduledToday ? 'text-text-muted opacity-50 hover:opacity-100' : 'text-text-muted/20 opacity-20'}`} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Progress view */}
                                <div className="mt-6">
                                    <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider px-1 flex justify-between">
                                        <span>Recent Activity</span>
                                        <span>Last 7 Days</span>
                                    </p>
                                    <div className="flex gap-2">
                                        {getLast7Days().map((date, i) => {
                                            const completed = habit.history?.some(
                                                h => new Date(h).toDateString() === date.toDateString()
                                            );
                                            const isScheduled = (habit.frequency === 'daily' || habit.frequency === 'weekly' || habit.selectedDays?.includes(date.getDay()));
                                            const isCurrent = date.toDateString() === new Date().toDateString();

                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 h-3 rounded-full transition-all ${completed
                                                        ? habit.type === 'good' ? 'bg-success shadow-sm shadow-success/20' : 'bg-error shadow-sm shadow-error/20'
                                                        : isCurrent ? 'bg-border animate-pulse' : isScheduled ? 'bg-surface-elevated/80 border border-border/20' : 'bg-surface-elevated/20'
                                                        }`}
                                                    title={`${date.toLocaleDateString()}${!isScheduled ? ' (Not scheduled)' : ''}`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between mt-2 px-1">
                                        <span className="text-[10px] text-text-muted font-bold">6 DAYS AGO</span>
                                        <span className="text-[10px] text-text-muted font-bold uppercase">TODAY</span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({ name: '', type: 'good', frequency: 'daily', selectedDays: [0, 1, 2, 3, 4, 5, 6] });
                }}
                title="Start New Habit"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!formData.name.trim() || (formData.frequency === 'custom' && formData.selectedDays.length === 0)}>
                            Create Habit
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">What habit are you tracking?</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Morning Run, Deep Work, Zero Sugar"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px] font-medium"
                            >
                                <option value="good">Building Habit</option>
                                <option value="bad">Breaking Habit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Target Frequency</label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px] font-medium"
                            >
                                <option value="daily">Every Day</option>
                                <option value="weekly">Once a Week</option>
                                <option value="custom">Custom Days</option>
                            </select>
                        </div>
                    </div>

                    {formData.frequency === 'custom' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-bold mb-3 text-text text-center uppercase tracking-widest opacity-70">Repeat on</label>
                            <div className="flex justify-between gap-2 p-3 bg-surface-elevated rounded-2xl border border-border">
                                {DAYS.map((day) => {
                                    const isSelected = formData.selectedDays.includes(day.value);
                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDaySelection(day.value)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${isSelected
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                                    : 'text-text-muted hover:bg-background hover:text-text'
                                                }`}
                                        >
                                            {day.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
}

function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date);
    }
    return dates;
}
