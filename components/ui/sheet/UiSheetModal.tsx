import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'

import { useSheetModal } from '@/hooks/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

export type UiSheetModalProps = BottomSheetModalProps

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheetModal = forwardRef<BottomSheetModal, UiSheetModalProps>(function UiSheetModal(props, ref) {
  const { bottomSheetStyle } = useTheme()
  const sheetHeight = useSheetModal()

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={BackdropComponent}
      animatedPosition={sheetHeight?.height}
      animatedIndex={sheetHeight?.index}
      {...bottomSheetStyle}
      {...props}
    >
      {props.children}
    </BottomSheetModal>
  )
})
