import { useLines } from '@/stores/lines'
import { LineBusMarkers } from './LineBusMarkers'
import { useShallow } from 'zustand/react/shallow'

export function LineMarkers() {
  const keys = useLines(useShallow(state => Object.keys(state.lines)))

  return (
    <>
      {keys.map(key => (
        <LineBusMarkers key={key} code={key} />
      ))}
    </>
  )
}
