import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'

import { useTheme } from '@/hooks/useTheme'

export type UiSheetModalProps = BottomSheetModalProps

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheetModal = forwardRef<BottomSheetModal, UiSheetModalProps>(function UiSheetModal(props, ref) {
  const { bottomSheetStyle } = useTheme()

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={BackdropComponent}
      {...bottomSheetStyle}
      {...props}
    >
      {props.children}
    </BottomSheetModal>
  )
})
