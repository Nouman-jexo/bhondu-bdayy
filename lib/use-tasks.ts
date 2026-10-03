'use client'

import { useCallback, useSyncExternalStore } from 'react'

export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

const STORAGE_KEY = 'tasks:v1'
const EMPTY: Task[] = []
const listeners = new Set<() => void>()
let cache: Task[] | null = null

function read(): Task[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed) ? parsed : []
  } catch {
    cache = []
  }
  return cache
}

function write(next: Task[]) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {}
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    cache = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useTasks() {
  const tasks = useSyncExternalStore(subscribe, read, () => EMPTY)

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim().slice(0, 200)
    if (!trimmed) return
    write([{ id: crypto.randomUUID(), title: trimmed, done: false, createdAt: Date.now() }, ...read()])
  }, [])

  const toggleTask = useCallback((id: string) => {
    write(read().map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }, [])

  const renameTask = useCallback((id: string, title: string) => {
    const trimmed = title.trim().slice(0, 200)
    if (!trimmed) return
    write(read().map((task) => (task.id === id ? { ...task, title: trimmed } : task)))
  }, [])

  const deleteTask = useCallback((id: string) => {
    write(read().filter((task) => task.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    write(read().filter((task) => !task.done))
  }, [])

  return { tasks, addTask, toggleTask, renameTask, deleteTask, clearCompleted }
}
