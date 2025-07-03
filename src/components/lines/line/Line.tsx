import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetOptions } from '@/components/ui/sheet/UiSheetOptions'

import { useMap } from '@/hooks/contexts/useMap'
import { useLine } from '@/hooks/queries/useLine'
import { ColorSchemesContext, useTheme } from '@/hooks/useTheme'

import { UiButton } from '../../ui/UiButton'

import { LineAnnouncements } from './LineAnnouncements'
import { LineBusStops } from './LineBusStops'
import { LineGroups } from './LineGroups'
import { LineName } from './LineName'
import { LineRoutes } from './LineRoutes'

import { queryClient } from '@/api/client'
import { getLineBusStops } from '@/api/getLineBusStops'
import { changeRouteDirection, getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { deleteLine } from '@/stores/lines'
import { toggleLineVisibility, toggleLineMinimization, useMiscStore } from '@/stores/misc'
import { i18n } from '@/translations/i18n'

export interface LineProps {
  lineCode: string
  variant?: 'solid' | 'soft'
  containerStyle?: StyleProp<ViewStyle>
  forTimetable?: boolean // New prop for timetable screen
}

const Line = ({ lineCode, variant = 'soft', forTimetable = false, ...props }: LineProps) => {
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const [isMinimized, setIsMinimized] = useState(false)

  const { schemeColor, storedTheme } = useTheme(lineCode)
  const { lineWidth } = useLine(lineCode)

  const map = useMap()
  const uiSheetButtonModal = useRef<BottomSheetModal>(null)
  const uiSheetLineGroupsModal = useRef<BottomSheetModal>(null)

  const isVisible = useSharedValue(true)

  useEffect(() => {
    const unsubVisible = useMiscStore.subscribe(
      state => state.invisibleLines,
      (newCodes) => {
        isVisible.value = !newCodes.includes(lineCode)
        if (isVisible.value) return

        const routeCode = getSelectedRouteCode(lineCode)

        const coords = queryClient
          .getQueryData<Awaited<ReturnType<typeof getLineBusStops>>>([`stop-locations`, routeCode])
          ?.map(coords => ({
            latitude: coords.y_coord,
            longitude: coords.x_coord,
          }))

        if (!coords) return
        map?.current?.fitInsideCoordinates(coords)
      },
      {
        fireImmediately: true,
      },
    )

    const unsubMinimized = useMiscStore.subscribe(
      state => state.minimizedLines,
      (minimizedCodes) => {
        setIsMinimized(minimizedCodes.includes(lineCode))
      },
      {
        fireImmediately: true,
      },
    )

    return () => {
      unsubVisible()
      unsubMinimized()
    }
  }, [isVisible, isMinimized, lineCode, map])

  const handleVisibility = () => toggleLineVisibility(lineCode)
  const handleDelete = () => deleteLine(lineCode)
  const handleRouteChange = () => changeRouteDirection(lineCode)
  const handleMinimize = () => toggleLineMinimization(lineCode)

  const openMenu = () => uiSheetButtonModal.current?.present()
  const openGroupMenu = () => uiSheetLineGroupsModal.current?.present()

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: variant === 'soft' ? schemeColor.surface : schemeColor.primary,
      width: lineWidth,
    }),
    [lineWidth, schemeColor.primary, schemeColor.surface, variant],
  )

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isVisible.value ? 1 : 0.4),
    }),
    [],
  )

  const buttonContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: schemeColor.surfaceContainerHigh,
    }),
    [schemeColor],
  )

  return (
    <ColorSchemesContext value={storedTheme}>
      <Animated.View
        style={[containerStyle, containerAnimatedStyle, styles.container, props.containerStyle]}
        key={lineCode}
        {...props}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <LineName lineCode={lineCode} variant={variant} />
          </View>
          
          {!forTimetable && (
            <View style={styles.buttonsContainer}>
              <UiButton 
                onPress={handleMinimize} 
                icon={isMinimized ? "chevron-down" : "chevron-up"} 
                variant="soft" 
                iconSize="sm"
                containerStyle={styles.smallButton}
              />
              <UiButton 
                onPress={handleVisibility} 
                icon="eye" 
                variant="soft" 
                iconSize="sm"
                containerStyle={styles.smallButton}
              />

              {selectedCity === 'istanbul' && (
                <LineAnnouncements lineCode={lineCode} containerStyle={styles.smallButton} />
              )}

              <UiButton 
                onPress={openMenu} 
                icon="menu" 
                variant="soft" 
                iconSize="sm"
                containerStyle={styles.smallButton}
              />
            </View>
          )}
        </View>

        {(!isMinimized || forTimetable) && (
          <>
            <LineBusStops lineCode={lineCode} />

            <View style={styles.lineButtonsContainer}>
              <UiButton onPress={handleRouteChange} icon="repeat" variant="soft" iconSize="sm" />
              <LineRoutes lineCode={lineCode} />
            </View>
          </>
        )}

        <UiSheetOptions
          cRef={uiSheetButtonModal}
          options={[
            {
              icon: 'add-circle',
              title: i18n.t('addToGroup'),
              onPress: openGroupMenu,
            },
            {
              icon: 'trash',
              title: i18n.t('deleteLine'),
              onPress: handleDelete,
            },
          ]}
          title={lineCode}
          icon="bus"
        />

        <LineGroups cRef={uiSheetLineGroupsModal} lineCodeToAdd={lineCode} />
      </Animated.View>
    </ColorSchemesContext>
  )
}

export const LineMemoized = memo(Line)

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    gap: 8,
    flexShrink: 0,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40, // Slightly increased for better alignment
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 8,
    minWidth: 0,
  },
  lineNameContainer: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    height: 32, // Match button height
  },
  smallButton: {
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
  },
  menuSheetContainer: {
    padding: 8,
    gap: 8,
  },
})
