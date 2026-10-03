'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <form
      className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 focus-within:ring-2 focus-within:ring-ring/50"
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim()) return
        onAdd(value)
        setValue('')
      }}
    >
      <label htmlFor="new-task" className="sr-only">
        New task
      </label>
      <input
        id="new-task"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        autoComplete="off"
        enterKeyHint="done"
        className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
      />
      <Button type="submit" size="icon-lg" className="size-11 rounded-xl" disabled={!value.trim()}>
        <Plus className="size-5" aria-hidden="true" />
        <span className="sr-only">Add task</span>
      </Button>
    </form>
  )
}
