'use client'

import { useState } from 'react'
import { ListChecks } from 'lucide-react'
import { TaskInput } from '@/components/task-input'
import { TaskItem } from '@/components/task-item'
import { cn } from '@/lib/utils'
import { useTasks } from '@/lib/use-tasks'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
] as const

type Filter = (typeof FILTERS)[number]['value']

export function TaskApp() {
  const { tasks, addTask, toggleTask, renameTask, deleteTask, clearCompleted } = useTasks()
  const [filter, setFilter] = useState<Filter>('all')

  const doneCount = tasks.filter((task) => task.done).length
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0
  const visible = tasks.filter((task) =>
    filter === 'all' ? true : filter === 'done' ? task.done : !task.done,
  )

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),2rem)]">
      <header className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground" suppressHydrationWarning>
              {today}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance">Tasks</h1>
          </div>
          <p className="text-sm text-muted-foreground tabular-nums">
            <span className="text-2xl font-semibold text-foreground">{doneCount}</span>
            {` / ${tasks.length} done`}
          </p>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Tasks completed"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <TaskInput onAdd={addTask} />

      <section aria-label="Task list" className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div role="tablist" aria-label="Filter tasks" className="flex gap-1 rounded-xl bg-muted p-1">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  filter === option.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {doneCount > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
            >
              Clear done
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <ul className="flex flex-col">
            {visible.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onRename={renameTask} onDelete={deleteTask} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <ListChecks className="size-10 text-primary" aria-hidden="true" />
            <p className="font-medium">
              {tasks.length === 0 ? 'No tasks yet' : filter === 'done' ? 'Nothing finished yet' : 'All caught up'}
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              {tasks.length === 0
                ? 'Add your first task above. Everything is saved on this device and works offline.'
                : 'Switch filters to see your other tasks.'}
            </p>
          </div>
        )}
      </section>

      <footer className="text-center text-xs text-muted-foreground">Tap a task to edit it</footer>
    </main>
  )
}
