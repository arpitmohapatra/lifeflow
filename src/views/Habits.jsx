import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';

export function Habits() {
    const { data: habits, addItem, updateItem, removeItem } = useDB(STORES.HABITS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'good',
        frequency: 'daily',
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
        setFormData({ name: '', type: 'good', frequency: 'daily' });
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

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Habits</h1>
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
                    {habits.map((habit, index) => (
                        <Card
                            key={habit.id}
                            className="animate-slide-up flex flex-col justify-between"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div>
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
                                            <p className="text-sm text-text-secondary uppercase tracking-widest font-bold">
                                                {habit.frequency}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={habit.type === 'good' ? 'success' : 'error'} className="py-2 px-3 text-sm">
                                        {habit.streak || 0}-day streak
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border mb-6">
                                    <span className="font-bold text-text-secondary">
                                        Log today
                                    </span>
                                    <button
                                        onClick={() => toggleToday(habit)}
                                        className="transition-all hover:scale-110 active:scale-95 cursor-pointer"
                                    >
                                        {isCompletedToday(habit) ? (
                                            <CheckCircle2 className="w-10 h-10 text-success" />
                                        ) : (
                                            <Circle className="w-10 h-10 text-text-muted opacity-50 hover:opacity-100" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Progress view */}
                            <div>
                                <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Recent Activity</p>
                                <div className="flex gap-2">
                                    {getLast7Days().map((date, i) => {
                                        const completed = habit.history?.some(
                                            h => new Date(h).toDateString() === date.toDateString()
                                        );
                                        const isCurrent = date.toDateString() === new Date().toDateString();
                                        return (
                                            <div
                                                key={i}
                                                className={`flex-1 h-3 rounded-full transition-all ${completed
                                                        ? habit.type === 'good' ? 'bg-success' : 'bg-error'
                                                        : isCurrent ? 'bg-border animate-pulse' : 'bg-surface-elevated'
                                                    }`}
                                                title={date.toLocaleDateString()}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 px-1">
                                    <span className="text-[10px] text-text-muted font-bold">6 DAYS AGO</span>
                                    <span className="text-[10px] text-text-muted font-bold">TODAY</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({ name: '', type: 'good', frequency: 'daily' });
                }}
                title="Start New Habit"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Create Habit</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px]"
                            >
                                <option value="good">Building</option>
                                <option value="bad">Breaking</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Target Frequency</label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px]"
                            >
                                <option value="daily">Every Day</option>
                                <option value="weekly">Every Week</option>
                            </select>
                        </div>
                    </div>
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
