import { useState } from 'react';
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { useDB } from '../hooks/useDB';
import { STORES } from '../utils/db';
import { formatDate } from '../utils/date';

export function Notes() {
    const { data: notes, addItem, updateItem, removeItem } = useDB(STORES.NOTES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const noteData = {
            ...formData,
            id: editingNote?.id || Date.now().toString(),
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            created: editingNote?.created || new Date().toISOString(),
            updated: new Date().toISOString(),
        };

        if (editingNote) {
            await updateItem(noteData);
        } else {
            await addItem(noteData);
        }

        setIsModalOpen(false);
        setEditingNote(null);
        setFormData({ title: '', content: '', tags: '' });
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            tags: note.tags?.join(', ') || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this note?')) {
            await removeItem(id);
        }
    };

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Notes</h1>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    New Note
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, content or tags..."
                    className="pl-12 h-12 rounded-xl shadow-sm border-transparent bg-surface focus:bg-background"
                />
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title={searchQuery ? 'No results found' : 'No notes yet'}
                    description={searchQuery ? 'Try matching something else' : 'Capture your thoughts and keep them organized'}
                    action={!searchQuery && <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Note</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note, index) => (
                        <Card
                            key={note.id}
                            className="animate-slide-up flex flex-col h-full hover:ring-2 hover:ring-primary/20"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => handleEdit(note)}
                        >
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-bold text-xl text-text leading-tight">{note.title}</h3>
                                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => handleEdit(note)}
                                            className="p-2 rounded-xl hover:bg-background transition-colors text-text-secondary hover:text-primary"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(note.id)}
                                            className="p-2 rounded-xl hover:bg-background transition-colors text-text-muted hover:text-error"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-base line-clamp-5 text-text-secondary">
                                    {note.content}
                                </p>

                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {note.tags.map((tag) => (
                                            <Badge key={tag} className="bg-secondary/10 text-secondary border-transparent">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-text-muted">
                                <span>{formatDate(note.updated)}</span>
                                <span>{note.content.length} characters</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingNote(null);
                    setFormData({ title: '', content: '', tags: '' });
                }}
                title={editingNote ? 'Edit Note' : 'Create Note'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Discard
                        </Button>
                        <Button onClick={handleSubmit}>
                            {editingNote ? 'Update Note' : 'Save Note'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Note Headline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Type your notes here..."
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl border resize-none bg-surface border-border text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-text">Tags (comma separated)</label>
                        <Input
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g. brainstorming, important, travel"
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
}
