'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteThought } from './actions';

interface DeleteButtonProps {
    id: string;
}

export function DeleteButton({ id }: DeleteButtonProps) {
    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this thought?')) {
            await deleteThought(id);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
