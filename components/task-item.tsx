'use client'

import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Task } from '@/lib/use-tasks'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onRename, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  const commit = () => {
    if (draft.trim() && draft !== task.title) onRename(task.id, draft)
    else setDraft(task.title)
    setEditing(false)
  }

  return (
    <li className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/60">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        onClick={() => onToggle(task.id)}
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          task.done ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50 hover:border-primary',
        )}
      >
        {task.done && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
      </button>

      {editing ? (
        <input
          autoFocus
          value={draft}
          maxLength={200}
          aria-label="Edit task"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return
            if (event.key === 'Enter') commit()
            if (event.key === 'Escape') {
              setDraft(task.title)
              setEditing(false)
            }
          }}
          className="h-8 min-w-0 flex-1 rounded-md bg-background px-2 text-base outline-none ring-2 ring-ring/50"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(task.title)
            setEditing(true)
          }}
          className={cn(
            'min-w-0 flex-1 truncate text-left text-base outline-none focus-visible:underline',
            task.done && 'text-muted-foreground line-through',
          )}
          aria-label={`Edit "${task.title}"`}
        >
          {task.title}
        </button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-destructive md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        <Trash2 aria-hidden="true" />
        <span className="sr-only">{`Delete "${task.title}"`}</span>
      </Button>
    </li>
  )
}
