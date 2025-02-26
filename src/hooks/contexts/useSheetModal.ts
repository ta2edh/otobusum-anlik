import { createContext, useContext } from 'react'
import { SharedValue } from 'react-native-reanimated'

export interface sheetContextValues {
  height: SharedValue<number>
  index: SharedValue<number>
}

export const SheetContext = createContext<sheetContextValues | undefined>(undefined)

export const useSheetModal = () => {
  const context = useContext(SheetContext)

  return context
}
