import { useCallback, useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initial: T,
  serialize: (v: T) => string = JSON.stringify,
  deserialize: (s: string) => T = JSON.parse,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      return deserialize(raw)
    } catch {
      return initial
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
        try {
          localStorage.setItem(key, serialize(next))
        } catch {
          /* quota or private mode */
        }
        return next
      })
    },
    [key, serialize, deserialize],
  )

  return [stored, setValue]
}

export function useLocalStorageSet(
  key: string,
  initial: string[] = [],
): [Set<string>, (updater: Set<string> | ((prev: Set<string>) => Set<string>)) => void] {
  const [arr, setArr] = useLocalStorage<string[]>(key, initial)
  const setSet = useCallback(
    (updater: Set<string> | ((prev: Set<string>) => Set<string>)) => {
      setArr((prevArr) => {
        const prev = new Set(prevArr)
        const next = typeof updater === 'function' ? updater(prev) : updater
        return [...next]
      })
    },
    [setArr],
  )
  return [new Set(arr), setSet]
}
