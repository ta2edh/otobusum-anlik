import Ionicons from '@react-native-vector-icons/ionicons'
import { FlashList, ListRenderItem, ViewToken } from '@shopify/flash-list'
import { useCallback, useMemo, useRef } from 'react'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated'

import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiButton } from '@/components/ui/UiButton'
import { UiText } from '@/components/ui/UiText'

import { useMap } from '@/hooks/contexts/useMap'
import { useLine } from '@/hooks/queries/useLine'
import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { BusLocation } from '@/api/getLineBusLocations'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { BusStop } from '@/types/bus'

interface LineBusStopsProps {
  lineCode: string
}

interface LineBusStopsItemProps {
  stop: BusStop
  index: number
  closestStop?: BusStop
  busses: BusLocation[]
}

const ITEM_SIZE = 46
const COLLAPSED = ITEM_SIZE * 3 - (ITEM_SIZE / 2) * 2
const EXPANDED = COLLAPSED * 2

const LineBusStopsItem = ({ stop, index, busses }: LineBusStopsItemProps) => {
  const { getSchemeColorHex } = useTheme()
  const map = useMap()

  const color = getSchemeColorHex('onPrimary')

  const showBusIcon = busses.find(bus => bus.closest_stop_code === stop.stop_code)

  const colorStyle: ViewStyle = {
    borderColor: getSchemeColorHex('primaryContainer'),
    backgroundColor: showBusIcon ? getSchemeColorHex('primaryContainer') : undefined,
  }

  const handleZoomBus = () => {
    map?.current?.moveTo({
      latitude: stop.y_coord,
      longitude: stop.x_coord,
    })
  }

  return (
    <View style={styles.item}>
      <View style={styles.itemInner}>
        <UiText style={[{ color }, styles.itemIndex]}>{index + 1}</UiText>

        <View style={[styles.itemCircle, colorStyle]}>
          {showBusIcon && (
            <Ionicons
              name="bus-outline"
              color={getSchemeColorHex('onPrimaryContainer')}
              size={20}
            />
          )}
        </View>

        <UiText style={{ color }}>{stop.stop_name}</UiText>
      </View>

      {showBusIcon && map && (
        <UiButton
          icon="locate"
          onPress={handleZoomBus}
        />
      )}
    </View>
  )
}

export const LineBusStops = ({ lineCode }: LineBusStopsProps) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))
  const containerHeight = useSharedValue(COLLAPSED)
  const currentViewableItems = useRef<ViewToken[]>([])
  const flashlistRef = useRef<FlashList<BusStop>>(null)

  const { getSchemeColorHex } = useTheme()
  const { query: stops, closestStop } = useLineBusStops(routeCode, true)
  const { query: line } = useLine(lineCode)

  const busses = useMemo(
    () => line.data?.filter(bus => bus.route_code === routeCode) || [],
    [line, routeCode],
  )

  const renderItem: ListRenderItem<BusStop> = useCallback((props) => {
    return (
      <LineBusStopsItem
        stop={props.item}
        index={props.index}
        closestStop={closestStop}
        busses={busses}
      />
    )
  }, [closestStop, busses])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    }
  })

  if (stops.isPending) {
    return <UiActivityIndicator color={getSchemeColorHex('onPrimary')} />
  }

  const handleScrollToBus = () => {
    const busInView = line.data?.find(
      bus => currentViewableItems.current.find(item => item.item.stop_code === bus.closest_stop_code),
    )

    const stopIndex = stops.data?.findIndex(stop => stop.stop_code === busInView?.closest_stop_code)

    if (stopIndex !== undefined) {
      flashlistRef.current?.scrollToIndex({
        animated: true,
        index: stopIndex,
        viewPosition: 0.5,
      })
    }
  }

  return (
    <Animated.View style={animatedStyle}>
      <FlashList
        ref={flashlistRef}
        data={stops.data}
        renderItem={renderItem}
        estimatedItemSize={ITEM_SIZE}
        overrideItemLayout={(layout) => {
          layout.size = ITEM_SIZE
        }}
        onScrollBeginDrag={() => {
          // eslint-disable-next-line react-compiler/react-compiler
          containerHeight.value = withTiming(EXPANDED)
        }}
        onMomentumScrollEnd={() => {
          containerHeight.value = withTiming(COLLAPSED, undefined, () => {
            runOnJS(handleScrollToBus)()
          })
        }}
        fadingEdgeLength={40}
        drawDistance={1}
        {
          ...Platform.OS !== 'web'
            ? {
                onViewableItemsChanged: ({ viewableItems }) => {
                  currentViewableItems.current = viewableItems
                },
              }
            : {}
        }
      />
    </Animated.View>
  )
}

// export const LineBusStops = ({ lineCode, variant = 'solid' }: LineBusStopsProps) => {
//   const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))

//   const flashlistRef = useAnimatedRef<FlashList<BusStop>>()
//   const currentViewableItems = useRef<ViewToken[]>([])
//   const currentTrackedBus = useRef<BusLocation>()
//   const map = useMap()

//   const containerHeight = useSharedValue(COLLAPSED)
//   const isScrolling = useSharedValue(false)

//   const { query: { data: line } } = useLine(lineCode)

//   const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))

//   const { closestStop, query } = useLineBusStops(routeCode, true)
//   const { getSchemeColorHex } = useTheme(lineTheme)

//   const busses = useMemo(
//     () => line?.filter(bus => bus.route_code === routeCode),
//     [line, routeCode],
//   )

//   const scrollToTrackedBus = useCallback(() => {
//     if (!currentTrackedBus.current) return

//     const updatedBus = busses?.find(bus => bus.bus_id === currentTrackedBus.current?.bus_id)
//     if (!updatedBus) return

//     const stopIndex = query.data?.findIndex(stop => stop.stop_code === updatedBus.closest_stop_code)

//     if (stopIndex === undefined || stopIndex === -1) {
//       currentTrackedBus.current = undefined
//     } else {
//       flashlistRef.current?.scrollToIndex({
//         animated: true,
//         index: stopIndex,
//         viewPosition: 0.5,
//       })
//     }
//   }, [busses, flashlistRef, query.data])

//   const snapToBus = useCallback(() => {
//     if (isScrolling.value) return

//     const trackedBus = busses?.find((bus) => {
//       return currentViewableItems.current.find(({ item }: { item: BusStop }) => {
//         return item.stop_code === bus.closest_stop_code
//       })
//     })

//     if (!trackedBus) {
//       currentTrackedBus.current = undefined
//       containerHeight.value = withDelay(1000, withTiming(COLLAPSED))
//     } else {
//       currentTrackedBus.current = trackedBus
//       containerHeight.value = withTiming(COLLAPSED)

//       setTimeout(() => {
//         scrollToTrackedBus()
//       }, 300)
//     }
//     // eslint-disable-next-line react-compiler/react-compiler
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [busses, scrollToTrackedBus])

//   const snapToBusDebounced = useDebouncedCallback(snapToBus, 400)

//   useEffect(() => {
//     if (currentTrackedBus.current || !closestStop || !query.data) return
//     const closestIndex = query.data.findIndex(stop => stop.stop_code === closestStop?.stop_code)

//     flashlistRef.current?.scrollToIndex({
//       animated: true,
//       index: closestIndex,
//       viewPosition: 0.5,
//     })
//   }, [closestStop, flashlistRef, query.data])

//   useEffect(() => {
//     scrollToTrackedBus()
//   }, [line, scrollToTrackedBus])

//   useAnimatedReaction(
//     () => isScrolling.value,
//     () => {
//       if (!isScrolling.value) {
//         runOnJS(snapToBusDebounced)()
//       }
//     },
//     [snapToBus],
//   )

//   const animatedContainerStyle = useAnimatedStyle(() => {
//     return {
//       height: containerHeight.value,
//     }
//   }, [])

//   const color = getSchemeColorHex(variant === 'solid' ? 'onPrimary' : 'onSurface')

//   const renderItem: ListRenderItem<BusStop> = useCallback(
//     ({ item, index }) => {
//       const closestBus = busses?.find(bus => bus.closest_stop_code === item.stop_code)

//       const colorStyle: ViewStyle = {
//         borderColor: getSchemeColorHex('primaryContainer'),
//         backgroundColor: closestBus ? getSchemeColorHex('primaryContainer') : undefined,
//       }

//       const handleZoomBus = () => {
//         map?.current?.moveTo({
//           latitude: item.y_coord,
//           longitude: item.x_coord,
//         })
//       }

//       return (
//         <View style={styles.item}>
//           <UiText style={[{ color }, styles.itemIndex]}>{index + 1}</UiText>

//           <View style={styles.itemTitle}>
//             <View style={[styles.itemCircle, colorStyle]}>
//               {closestBus && (
//                 <Ionicons
//                   name="bus-outline"
//                   color={getSchemeColorHex('onPrimaryContainer')}
//                   size={20}
//                 />
//               )}
//             </View>

//             <View style={styles.itemTitleInner}>
//               <UiText style={{ color }} numberOfLines={1}>
//                 {item.stop_name}
//               </UiText>

//               {closestStop?.stop_code === item.stop_code && (
//                 <UiText info style={{ color, fontSize: 12 }}>
//                   {i18n.t('closeToThisStop')}
//                 </UiText>
//               )}
//             </View>
//           </View>

//           {closestBus && map && (
//             <UiButton
//               icon="locate"
//               onPress={handleZoomBus}
//             />
//           )}
//         </View>
//       )
//     },
//     [busses, closestStop?.stop_code, color, getSchemeColorHex, map],
//   )

//   if (query.isPending) {
//     return <UiActivityIndicator color={getSchemeColorHex('onPrimary')} />
//   }

//   const handleScrollDragStart = () => {
//     isScrolling.value = true
//     containerHeight.value = withTiming(EXPANDED)
//   }

//   const handleScrollMomentumEnd = () => {
//     isScrolling.value = false
//   }

//   const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
//     currentViewableItems.current = viewableItems
//   }

//   const overrideItemLayout = (layout: { size?: number }): void => {
//     layout.size = ITEM_SIZE
//   }

//   return (
//     <Animated.View style={animatedContainerStyle}>
//       <AnimatedFlashList
//         ref={flashlistRef}
//         data={query.data}
//         renderItem={renderItem}
//         estimatedItemSize={ITEM_SIZE}
//         overrideItemLayout={overrideItemLayout}
//         fadingEdgeLength={40}
//         onScrollBeginDrag={handleScrollDragStart}
//         onMomentumScrollEnd={handleScrollMomentumEnd}
//         drawDistance={1}
//         {
//           ...Platform.OS !== 'web'
//             ? {
//                 onViewableItemsChanged: handleViewableItemsChanged,
//               }
//             : {}
//         }

//         // viewabilityConfig={{
//         //   minimumViewTime: 200,
//         //   waitForInteraction: true,
//         //   itemVisiblePercentThreshold: 100,
//         // }}
//         snapToInterval={ITEM_SIZE}
//       />
//     </Animated.View>
//   )
// }

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingVertical: 4,
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIndex: {
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
})
