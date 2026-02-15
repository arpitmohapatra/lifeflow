import { useState, useEffect } from 'react';
import { Plus, Circle, CheckCircle2, Trash2, Edit, MoreVertical, GripVertical, Clock, Tag } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';
import { formatDate, isOverdue } from '../utils/date';
import { ICON_OPTIONS, IconRenderer } from '../utils/icons';

const COLUMNS = [
    { id: 'pending', title: 'Pending', icon: Circle, color: 'text-text-muted' },
    { id: 'in-progress', title: 'In Progress', icon: Clock, color: 'text-primary' },
    { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-success' },
];

export function Tasks() {
    const { data: tasks, addItem, updateItem, removeItem } = useDB(STORES.TASKS);
    const { data: lists } = useDB(STORES.LISTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        priority: 'medium',
        dueDate: '',
        status: 'pending',
        icon: 'CheckSquare'
    });

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const task = tasks.find(t => t.id === draggableId);
        if (!task) return;

        const updatedTask = {
            ...task,
            status: destination.droppableId,
            completed: destination.droppableId === 'completed',
            updatedAt: new Date().toISOString()
        };

        await updateItem(updatedTask);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskData = {
            ...formData,
            id: editingTask?.id || Date.now().toString(),
            completed: formData.status === 'completed',
            createdAt: editingTask?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (editingTask) {
            await updateItem(taskData);
        } else {
            await addItem(taskData);
        }

        setIsModalOpen(false);
        setEditingTask(null);
        setFormData({ title: '', category: '', priority: 'medium', dueDate: '', status: 'pending', icon: 'CheckSquare' });
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            category: task.category || '',
            priority: task.priority || 'medium',
            dueDate: task.dueDate || '',
            status: task.status || (task.completed ? 'completed' : 'pending'),
            icon: task.icon || 'CheckSquare'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await removeItem(id);
        }
    };

    return (
        <div className="space-y-8 w-full h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold">Action Board</h1>
                    <p className="text-sm text-text-secondary mt-1 font-medium">Kanban management for productive work</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    New Task
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
                    {COLUMNS.map((column) => {
                        const ColumnIcon = column.icon;
                        const columnTasks = tasks.filter(t => {
                            const status = t.status || (t.completed ? 'completed' : 'pending');
                            return status === column.id;
                        });

                        return (
                            <div key={column.id} className="flex flex-col h-full bg-surface/50 rounded-2xl border border-border/50 p-4">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-2">
                                        <ColumnIcon className={`w-5 h-5 ${column.color}`} />
                                        <h2 className="font-bold text-lg">{column.title}</h2>
                                        <span className="bg-background text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-border">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 space-y-3 transition-colors rounded-xl p-2 ${snapshot.isDraggingOver ? 'bg-primary/5 ring-2 ring-primary/10 ring-inset' : ''
                                                }`}
                                            style={{ minHeight: '100px' }}
                                        >
                                            {columnTasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`group animate-fade-in`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <Card
                                                                className={`p-4 hover:ring-2 hover:ring-primary/20 transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary shadow-primary/20 rotate-1 scale-105 z-50 bg-background' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div {...provided.dragHandleProps} className="mt-1 text-text-muted hover:text-text cursor-grab active:cursor-grabbing">
                                                                        <GripVertical className="w-4 h-4" />
                                                                    </div>

                                                                    <div className="flex-1 min-w-0" onClick={() => handleEdit(task)}>
                                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                                            {task.priority && (
                                                                                <Badge variant={
                                                                                    task.priority === 'high' ? 'error' :
                                                                                        task.priority === 'medium' ? 'warning' :
                                                                                            'default'
                                                                                } className="text-[10px] py-0 px-1.5 uppercase font-black">
                                                                                    {task.priority}
                                                                                </Badge>
                                                                            )}
                                                                            {task.category && (
                                                                                <Badge className="bg-primary/5 text-primary border-transparent text-[10px] py-0 px-1.5 uppercase font-black flex items-center gap-1">
                                                                                    <Tag className="w-2.5 h-2.5" />
                                                                                    {task.category}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <IconRenderer iconName={task.icon || 'CheckSquare'} className="w-4 h-4 text-text-muted" />
                                                                            <h3 className={`font-bold text-sm leading-snug ${task.completed ? 'line-through opacity-50' : 'text-text'}`}>
                                                                                {task.title}
                                                                            </h3>
                                                                        </div>
                                                                        {task.dueDate && (
                                                                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${isOverdue(task.dueDate) && !task.completed ? 'text-error' : 'text-text-muted'}`}>
                                                                                <Clock className="w-3 h-3" />
                                                                                {formatDate(task.dueDate)}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-background transition-all text-text-muted hover:text-error"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {columnTasks.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-20 border-2 border-dashed border-border rounded-xl">
                                        <ColumnIcon className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-widest">No tasks</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                    setFormData({ title: '', category: '', priority: 'medium', dueDate: '', status: 'pending', icon: 'CheckSquare' });
                }}
                title={editingTask ? 'Edit Task' : 'Create Task'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {editingTask ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Task Name</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Task Icon</label>
                        <div className="grid grid-cols-8 gap-2 max-h-[120px] overflow-y-auto p-2 bg-surface-elevated rounded-xl border border-border">
                            {ICON_OPTIONS.map((option) => (
                                <button
                                    key={option.icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: option.icon })}
                                    className={`p-2 flex items-center justify-center rounded-lg transition-all ${formData.icon === option.icon ? 'bg-primary text-white shadow-md' : 'hover:bg-background text-text-muted hover:text-text'}`}
                                >
                                    <IconRenderer iconName={option.icon} className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px] font-medium"
                            >
                                <option value="">No Category</option>
                                {lists.map(list => (
                                    <option key={list.id} value={list.name}>{list.name}</option>
                                ))}
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Goal">Goal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px] font-medium"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary h-[42px] font-medium"
                            >
                                {COLUMNS.map(col => (
                                    <option key={col.id} value={col.id}>{col.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-text">Due Date</label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
