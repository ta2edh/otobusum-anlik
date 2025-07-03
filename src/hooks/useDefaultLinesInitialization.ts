import { useEffect, useState } from 'react'
import { useLinesStore } from '@/stores/lines'

// This hook now only tracks if lines are ready to be rendered (after hydration)
export const useMapReadyToRenderLines = (mapReady: boolean = false) => {
  const [readyToRender, setReadyToRender] = useState(false)
  
  useEffect(() => {
    if (!mapReady) {
      console.log('�️ Map not ready yet, waiting...')
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>
    let unsubscribe: (() => void) | undefined
    
    const checkIfReady = () => {
      const linesState = useLinesStore.getState()
      
      console.log('🔍 Checking if ready to render existing lines')
      console.log('Has hydrated:', linesState._hasHydrated)
      console.log('Istanbul lines count:', linesState.lines.istanbul.length)
      console.log('Map ready:', mapReady)
      
      // Ready when store is hydrated and map is ready
      if (linesState._hasHydrated && mapReady) {
        console.log('✅ Ready to render existing lines!')
        setReadyToRender(true)
        
        if (unsubscribe) {
          unsubscribe()
        }
      }
    }

    // Subscribe to hydration changes
    unsubscribe = useLinesStore.subscribe(
      (state) => state._hasHydrated,
      (hasHydrated) => {
        if (hasHydrated && mapReady) {
          console.log('🔄 Store hydrated and map ready, can render lines')
          timeoutId = setTimeout(() => setReadyToRender(true), 100)
        }
      }
    )

    // Check immediately
    timeoutId = setTimeout(checkIfReady, 100)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (unsubscribe) unsubscribe()
    }
  }, [mapReady])

  return { readyToRender }
}
