'use client';

import { useState, useEffect, useTransition } from 'react';
import { saveLaunch } from '@/app/launches/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import { CardTitle, CardDescription } from '@/components/ui/Card';
import type { Launch, Brand } from '@/app/launches/LaunchesClient';

interface Task {
    text: string;
    completed: boolean;
}

interface LaunchFormProps {
  launchToEdit: Launch | null;
  brands: Brand[];
  onSave: () => void;
  onCancel: () => void;
}

export default function LaunchForm({ launchToEdit, brands, onSave, onCancel }: LaunchFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    brand_id: brands[0]?.id || '',
    status: 'planned' as "planned" | "in-progress" | "done",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (launchToEdit) {
      setFormData({
        title: launchToEdit.title,
        description: launchToEdit.description || '',
        start_date: launchToEdit.start_date.substring(0, 10),
        brand_id: launchToEdit.brand_id,
        status: launchToEdit.status,
      });
      setTasks(Array.isArray(launchToEdit.tasks) ? (launchToEdit.tasks as Task[]) : []);
    } else {
      setFormData({
        title: '', description: '', start_date: '',
        brand_id: brands[0]?.id || '', status: 'planned',
      });
      setTasks([]);
    }
  }, [launchToEdit, brands]);
  
  const handleTaskChange = (index: number, key: keyof Task, value: any) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [key]: value };
    setTasks(newTasks);
  };
  
  const handleAddTask = () => {
    if (newTaskText.trim()) {
      setTasks([...tasks, { text: newTaskText.trim(), completed: false }]);
      setNewTaskText('');
    }
  };
  
  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const payload = new FormData(e.currentTarget);
    payload.append('tasks', JSON.stringify(tasks));

    startTransition(async () => {
        const result = await saveLaunch(launchToEdit?.id || null, payload);
        if (result?.error) {
            setError(result.error);
        } else {
            onSave();
        }
    });
  };

  return (
    <>
    <div className="text-center mb-6">
        <CardTitle>{launchToEdit ? 'Edit Launch' : 'Schedule New Launch'}</CardTitle>
        <CardDescription>{launchToEdit ? 'Update your launch details.' : 'Add a new launch to your calendar.'}</CardDescription>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="title">Launch Title</Label>
            <Input id="title" name="title" required defaultValue={formData.title} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="brand_id">Brand</Label>
                <select id="brand_id" name="brand_id" defaultValue={formData.brand_id} required className="w-full mt-1 h-10 rounded-md border border-slate-700 bg-slate-800/50 px-3">
                  {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                </select>
            </div>
            <div>
                <Label htmlFor="start_date">Launch Date</Label>
                <Input id="start_date" name="start_date" type="date" required defaultValue={formData.start_date} />
            </div>
        </div>
        <div>
            <Label htmlFor="tasks">Tasks</Label>
            <div className="mt-1 space-y-2">
                {tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" checked={task.completed} onChange={(e) => handleTaskChange(index, 'completed', e.target.checked)} className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary" />
                        <Input value={task.text} onChange={(e) => handleTaskChange(index, 'text', e.target.value)} className="h-9 flex-grow" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTask(index)} className="h-8 w-8 text-red-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></Button>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <Input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="Add a new task..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}/>
                <Button type="button" onClick={handleAddTask}>Add Task</Button>
            </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="w-32">
                {isPending ? <Spinner /> : launchToEdit ? 'Save Changes' : 'Schedule'}
            </Button>
        </div>
    </form>
    </>
  );
}
