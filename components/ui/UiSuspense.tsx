import { Suspense, SuspenseProps } from 'react'

import { UiActivityIndicator } from './UiActivityIndicator'

export const UiSuspense = (props: SuspenseProps) => {
  return (
    <Suspense fallback={<UiActivityIndicator />} {...props}>
      {props.children}
    </Suspense>
  )
}
