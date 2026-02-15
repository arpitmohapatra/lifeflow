import { useState } from 'react';
import {
    Plus,
    Trash2,
    Check,
    Target as TargetIcon,
    ClipboardList,
    X
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';
import { ICON_OPTIONS, IconRenderer } from '../utils/icons';

export function Lists() {
    const { data: lists, addItem: addList, updateItem: updateList, removeItem: removeList } = useDB(STORES.LISTS);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeList, setActiveList] = useState(null);
    const [newItemText, setNewItemText] = useState('');
    const [listFormData, setListFormData] = useState({ name: '', color: '#8b5cf6', icon: 'List' });

    const handleCreateList = async (e) => {
        e.preventDefault();
        const newList = {
            id: Date.now().toString(),
            name: listFormData.name,
            color: listFormData.color,
            icon: listFormData.icon,
            items: [],
            createdAt: new Date().toISOString()
        };
        await addList(newList);
        setIsCreateModalOpen(false);
        setListFormData({ name: '', color: '#8b5cf6', icon: 'List' });
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemText.trim() || !activeList) return;

        const updatedList = {
            ...activeList,
            items: [
                ...(activeList.items || []),
                { id: Date.now().toString(), text: newItemText.trim(), completed: false }
            ]
        };
        await updateList(updatedList);
        setActiveList(updatedList);
        setNewItemText('');
    };

    const toggleItem = async (list, itemId) => {
        const updatedItems = (list.items || []).map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const updatedList = { ...list, items: updatedItems };
        await updateList(updatedList);
        if (activeList?.id === list.id) setActiveList(updatedList);
    };

    const deleteItem = async (list, itemId) => {
        const updatedItems = (list.items || []).filter(item => item.id !== itemId);
        const updatedList = { ...list, items: updatedItems };
        await updateList(updatedList);
        if (activeList?.id === list.id) setActiveList(updatedList);
    };

    const convertToTask = async (item) => {
        const newTask = {
            id: Date.now().toString(),
            title: item.text,
            category: activeList.name,
            priority: 'medium',
            status: 'pending',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const { add } = await import('../utils/db');
        await add(STORES.TASKS, newTask);
        alert(`"${item.text}" added to Action Board!`);
    };

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Checklists</h1>
                    <p className="text-sm text-text-secondary mt-1 font-medium">Grocery, home, and shopping lists</p>
                </div>
                <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Create New List</Button>
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map((list) => {
                    const completedCount = (list.items || []).filter(i => i.completed).length;
                    const totalCount = (list.items || []).length;
                    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                    return (
                        <Card
                            key={list.id}
                            className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer p-0 overflow-hidden flex flex-col h-full"
                            onClick={() => setActiveList(list)}
                        >
                            <div className="h-2 w-full" style={{ backgroundColor: list.color }} />
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-surface-elevated border border-border shadow-sm">
                                            <IconRenderer iconName={list.icon || 'List'} style={{ color: list.color }} />
                                        </div>
                                        <h3 className="text-lg font-bold text-text truncate max-w-[150px]">{list.name}</h3>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeList(list.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mt-auto space-y-3">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-text-muted">
                                        <span>{completedCount} / {totalCount} Items</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden border border-border/50">
                                        <div
                                            className="h-full transition-all duration-700 ease-out"
                                            style={{ width: `${progress}%`, backgroundColor: list.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {lists.length === 0 && (
                    <div className="col-span-full py-20 bg-surface/30 rounded-3xl border-2 border-dashed border-border/50">
                        <div className="flex flex-col items-center justify-center opacity-20 select-none">
                            <ClipboardList className="w-20 h-20 mb-4" />
                            <h3 className="text-xl font-bold uppercase tracking-widest">No checklists yet</h3>
                        </div>
                    </div>
                )}
            </div>

            {/* List Detail Modal */}
            <Modal
                isOpen={!!activeList}
                onClose={() => setActiveList(null)}
                title={activeList?.name || 'List'}
                footer={
                    <Button variant="secondary" onClick={() => setActiveList(null)}>Close</Button>
                }
            >
                {activeList && (
                    <div className="space-y-6">
                        {/* Status bar */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border">
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${((activeList.items || []).filter(i => i.completed).length / (activeList.items || []).length || 0) * 100}%`,
                                        backgroundColor: activeList.color
                                    }}
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                {Math.round(((activeList.items || []).filter(i => i.completed).length / (activeList.items || []).length || 0) * 100)}%
                            </span>
                        </div>

                        {/* Add Item Form */}
                        <form onSubmit={handleAddItem} className="flex gap-2">
                            <Input
                                placeholder="Add something to the list..."
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                className="flex-1"
                                autoFocus
                            />
                            <Button type="submit" size="sm" className="w-12 h-full rounded-xl">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </form>

                        {/* Items List */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                            {(activeList.items || []).length === 0 ? (
                                <p className="text-center py-10 text-text-muted text-sm italic font-medium">List is empty</p>
                            ) : (
                                activeList.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:bg-background transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleItem(activeList, item.id)}
                                            className="flex-shrink-0 cursor-pointer"
                                        >
                                            {item.completed ? (
                                                <div className="w-6 h-6 rounded-lg bg-success text-white flex items-center justify-center">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-lg border-2 border-border group-hover:border-text-muted transition-colors" />
                                            )}
                                        </button>
                                        <span className={`flex-1 text-sm font-medium ${item.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                                            {item.text}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => convertToTask(item)}
                                                className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all"
                                                title="Add to Action Board"
                                            >
                                                <TargetIcon className="w-4 h-4 ml-1" />
                                            </button>
                                            <button
                                                onClick={() => deleteItem(activeList, item.id)}
                                                className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create List Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Checklist"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateList}>Create List</Button>
                    </>
                }
            >
                <form onSubmit={handleCreateList} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">List Name</label>
                        <Input
                            placeholder="e.g. Grocery List, Travel Essentials"
                            value={listFormData.name}
                            onChange={e => setListFormData({ ...listFormData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Icon</label>
                        <div className="grid grid-cols-8 gap-2 max-h-[160px] overflow-y-auto p-2 bg-surface-elevated rounded-xl border border-border">
                            {ICON_OPTIONS.map((option) => (
                                <button
                                    key={option.icon}
                                    type="button"
                                    onClick={() => setListFormData({ ...listFormData, icon: option.icon })}
                                    className={`p-2.5 flex items-center justify-center rounded-xl transition-all ${listFormData.icon === option.icon ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/20' : 'hover:bg-background text-text-muted hover:text-text'}`}
                                >
                                    <IconRenderer iconName={option.icon} className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Theme Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b', '#0ea5e9', '#d946ef', '#f43f5e', '#a855f7'].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setListFormData({ ...listFormData, color })}
                                    className={`w-9 h-9 rounded-xl transition-all ${listFormData.color === color ? 'ring-4 ring-primary/20 scale-110 shadow-lg' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
