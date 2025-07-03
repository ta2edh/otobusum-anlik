import { useEffect, useState } from 'react'
import { useLinesStore } from '@/stores/lines'

/**
 * Hook to wait for Zustand store hydration
 */
export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)
  
  useEffect(() => {
    // Production'da timeout ekleyerek splash screen takılmasını önle
    const timeoutId = setTimeout(() => {
      console.warn('Store hydration timeout, forcing hydrated state')
      setHydrated(true)
    }, 3000) // 3 saniye timeout
    
    // Check if the store has been hydrated immediately
    const currentState = useLinesStore.getState()
    if (currentState._hasHydrated) {
      console.log('Store already hydrated')
      clearTimeout(timeoutId)
      setHydrated(true)
      return
    }

    console.log('Waiting for store hydration...')
    
    // Subscribe to hydration state changes
    const unsubscribe = useLinesStore.subscribe(
      (state) => state._hasHydrated,
      (hasHydrated) => {
        console.log('Hydration state changed:', hasHydrated)
        if (hasHydrated) {
          clearTimeout(timeoutId)
          setHydrated(true)
        }
      },
      {
        equalityFn: (a, b) => a === b,
      }
    )

    return () => {
      clearTimeout(timeoutId)
      unsubscribe?.()
    }
  }, [])

  return hydrated
}
