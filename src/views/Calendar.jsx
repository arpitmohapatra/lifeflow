import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';
import { getMonthDays, isToday, formatDate } from '../utils/date';

export function Calendar() {
    const [viewDate, setViewDate] = useState(new Date());
    const { data: events, addItem: addEvent, removeItem: removeEvent } = useDB(STORES.EVENTS);
    const { data: tasks } = useDB(STORES.TASKS);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        time: '',
        location: '',
        description: ''
    });

    const monthDays = getMonthDays(viewDate.getFullYear(), viewDate.getMonth());
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addEvent({
            ...formData,
            id: Date.now().toString(),
            date: selectedDate.toISOString()
        });
        setIsModalOpen(false);
        setFormData({ title: '', time: '', location: '', description: '' });
    };

    const getItemsForDate = (date) => {
        const dateStr = date.toDateString();
        const dayEvents = events.filter(e => new Date(e.date).toDateString() === dateStr);
        const dayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === dateStr);
        return [...dayEvents.map(e => ({ ...e, type: 'event' })), ...dayTasks.map(t => ({ ...t, type: 'task' }))];
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Calendar</h1>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setViewDate(new Date())}>Today</Button>
                    <div className="flex items-center bg-surface border border-border rounded-xl p-1">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-background rounded-lg transition-colors cursor-pointer">
                            <ChevronLeft className="w-5 h-5 text-text-secondary" />
                        </button>
                        <span className="px-4 font-bold text-sm min-w-[140px] text-center">
                            {monthName}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-background rounded-lg transition-colors cursor-pointer">
                            <ChevronRight className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-border/50">
                <div className="grid grid-cols-7 border-b border-border bg-surface/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {monthDays.map(({ date, isCurrentMonth }, i) => {
                        const items = getItemsForDate(date);
                        const isTodayDate = isToday(date);

                        return (
                            <div
                                key={i}
                                onClick={() => handleDateClick(date)}
                                className={`min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-border/30 transition-all hover:bg-primary/5 cursor-pointer flex flex-col gap-1 ${!isCurrentMonth ? 'opacity-30' : ''} ${i % 7 === 6 ? 'border-r-0' : ''}`}
                            >
                                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isTodayDate ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text'}`}>
                                    {date.getDate()}
                                </span>
                                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                                    {items.slice(0, 3).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate border ${item.type === 'event'
                                                    ? 'bg-secondary/10 border-secondary/20 text-secondary'
                                                    : 'bg-primary/5 border-primary/10 text-primary'
                                                }`}
                                        >
                                            {item.title}
                                        </div>
                                    ))}
                                    {items.length > 3 && (
                                        <div className="text-[8px] font-black text-text-muted px-1">
                                            +{items.length - 3} MORE
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedDate ? `Events for ${formatDate(selectedDate)}` : 'Event'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        <Button onClick={handleSubmit}>Save Event</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 mb-6">
                        {selectedDate && getItemsForDate(selectedDate).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${item.type === 'event' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                        {item.type === 'event' ? <CalendarIcon className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{item.title}</p>
                                        {item.time && <p className="text-xs text-text-muted">{item.time}</p>}
                                    </div>
                                </div>
                                {item.type === 'event' && (
                                    <button
                                        type="button"
                                        onClick={() => removeEvent(item.id)}
                                        className="text-text-muted hover:text-error transition-colors"
                                    >
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                        <p className="text-sm font-bold mb-3 uppercase tracking-wider text-text-muted">Add New Event</p>
                        <div className="space-y-3">
                            <Input
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    type="time"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                />
                                <Input
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    icon={MapPin}
                                />
                            </div>
                            <textarea
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-none"
                                placeholder="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
