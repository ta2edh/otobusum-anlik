import { Suspense } from 'react'

import { UiActivityIndicator } from './UiActivityIndicator'

interface UiSuspenseProps {
  children?: React.ReactNode
}

export const UiSuspense = (props: UiSuspenseProps) => {
  return (
    <Suspense fallback={<UiActivityIndicator />}>
      {props.children}
    </Suspense>
  )
}
