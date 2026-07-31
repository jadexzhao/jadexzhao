import { useCallback } from 'react'
import { useLocalStorage, useLocalStorageSet } from './useLocalStorage'
import type { Quack } from '../data/mockData'

export const PERSISTENCE_KEYS = {
  theme: 'quackr:theme',
  matches: 'quackr:matches',
  quacks: 'quackr:quacks',
  obsession: 'quackr:obsession',
} as const

export type Theme = 'light' | 'dark'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(PERSISTENCE_KEYS.theme) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  const legacy = localStorage.getItem('quack-theme') as Theme | null
  if (legacy === 'light' || legacy === 'dark') return legacy
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function usePersistedTheme(): [Theme, (next: Theme | ((prev: Theme) => Theme)) => void] {
  return useLocalStorage<Theme>(PERSISTENCE_KEYS.theme, readInitialTheme(), String, (s) => {
    return s === 'dark' ? 'dark' : 'light'
  })
}

export function usePersistedMatches(
  initial: string[] = ['drake'],
): [Set<string>, (updater: Set<string> | ((prev: Set<string>) => Set<string>)) => void] {
  return useLocalStorageSet(PERSISTENCE_KEYS.matches, initial)
}

export function usePersistedQuacks(initial: Quack[]): [Quack[], (value: Quack[] | ((prev: Quack[]) => Quack[])) => void] {
  return useLocalStorage<Quack[]>(PERSISTENCE_KEYS.quacks, initial)
}

export function usePersistedObsession(
  initial: string,
): [string, (value: string | ((prev: string) => string)) => void] {
  return useLocalStorage(PERSISTENCE_KEYS.obsession, initial)
}

export function usePersistedState<T>(
  key: string,
  initial: T,
  serialize?: (v: T) => string,
  deserialize?: (s: string) => T,
): [T, (value: T | ((prev: T) => T)) => void] {
  return useLocalStorage(key, initial, serialize, deserialize)
}

export function clearQuackrPersistence(): void {
  Object.values(PERSISTENCE_KEYS).forEach((k) => localStorage.removeItem(k))
}

export function useClearPersistence(onClear?: () => void): () => void {
  return useCallback(() => {
    clearQuackrPersistence()
    onClear?.()
  }, [onClear])
}
