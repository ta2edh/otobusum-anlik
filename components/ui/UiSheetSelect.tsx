import { RefObject } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import { UiText } from './UiText'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from '@/hooks/useTheme'
import { usePaddings } from '@/hooks/usePaddings'
import { colors } from '@/constants/colors'

interface Option<T> {
  label: string
  value: T
}

interface UiSheetSelectProps<T> {
  title: string
  options: Option<T>[]
  value: T
  onValueChange: (value: T) => void
}

export function UiSheetSelect<T>(
  props: UiSheetSelectProps<T> & { cRef: RefObject<BottomSheetModal> },
) {
  const { bottomSheetStyle } = useTheme()
  const paddings = usePaddings(true)

  return (
    <BottomSheetModal ref={props.cRef} {...bottomSheetStyle}>
      <BottomSheetView style={paddings}>
        <UiText info style={styles.title}>
          {props.title}
        </UiText>

        <View>
          {props.options.map(option => (
            <TouchableOpacity
              key={`${option.label}-${option.value}`}
              onPress={() => props.onValueChange?.(option.value)}
              style={styles.item}
            >
              <UiText key={option.label}>{option.label}</UiText>

              <View style={styles.outerCircle}>
                {props.value === option.value && <View style={styles.innerCircle} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    padding: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  innerCircle: {
    borderRadius: 999,
    backgroundColor: colors.primary,
    flex: 1,
  },
  title: {
    padding: 8,
  },
})
