import { Ionicons } from '@expo/vector-icons'
import { FlashList, ListRenderItem, ViewToken } from '@shopify/flash-list'
import { useCallback, useMemo, useRef, useEffect } from 'react'
import { Platform, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'
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
import { setLineExpanded, useMiscStore } from '@/stores/misc'
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
const COLLAPSED = ITEM_SIZE * 2 // Tam olarak 2 durak
const EXPANDED = ITEM_SIZE * 5 // 5 durak kadar

const LineBusStopsItem = ({ stop, index, busses }: LineBusStopsItemProps) => {
  const { schemeColor } = useTheme()
  const map = useMap()

  const showBusIcon = busses.find(bus => bus.closest_stop_code === stop.stop_code)

  const colorStyle: ViewStyle = {
    borderColor: schemeColor.primary,
    backgroundColor: showBusIcon ? schemeColor.primary : undefined,
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
        <UiText style={[{ color: schemeColor.onSurface }, styles.itemIndex]}>{index + 1}</UiText>

        <View style={[styles.itemCircle, colorStyle]}>
          {showBusIcon && (
            <Ionicons
              name="bus-outline"
              color={schemeColor.onPrimary}
              size={20}
            />
          )}
        </View>

        <UiText 
          style={{ color: schemeColor.onSurface, flex: 1 }} 
          size="sm"
          numberOfLines={1}
        >
          {stop.stop_name}
        </UiText>
      </View>

      {showBusIcon && map && <UiButton icon="locate" onPress={handleZoomBus} />}
    </View>
  )
}

export const LineBusStops = ({ lineCode }: LineBusStopsProps) => {
  const { height } = useWindowDimensions()
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))
  
  const containerHeight = useSharedValue(COLLAPSED) // Always start collapsed (2 stops)
  const currentViewableItems = useRef<ViewToken[]>([])
  const flashlistRef = useRef<FlashList<BusStop>>(null)

  // Listen to global expanded state
  const expandedLines = useMiscStore(state => state.expandedLines)
  const isExpanded = expandedLines.includes(lineCode)

  // Update height when expanded state changes
  useEffect(() => {
    const targetHeight = isExpanded ? EXPANDED : COLLAPSED
    containerHeight.value = withTiming(targetHeight, { duration: 300 })
  }, [isExpanded])

  const { schemeColor } = useTheme()
  const { query: stops, closestStop } = useLineBusStops(routeCode, true)
  const { query: line } = useLine(lineCode)

  const busses = useMemo(
    () => line.data?.filter(bus => bus.route_code === routeCode) || [],
    [line, routeCode],
  )

  const renderItem: ListRenderItem<BusStop> = useCallback(
    (props) => {
      return (
        <LineBusStopsItem
          stop={props.item}
          index={props.index}
          closestStop={closestStop}
          busses={busses}
        />
      )
    },
    [closestStop, busses],
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    }
  })

  const handleScrollToBus = () => {
    const busInView = line.data?.find(bus =>
      currentViewableItems.current.find(item => item.item.stop_code === bus.closest_stop_code),
    )

    const stopIndex = stops.data?.findIndex(
      stop => stop.stop_code === busInView?.closest_stop_code,
    )

    if (stopIndex !== undefined && stopIndex !== -1) {
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
          // When user starts scrolling, expand this line card
          setLineExpanded(lineCode, true)
        }}
        onMomentumScrollEnd={() => {
          // Center the bus when scrolling ends
          runOnJS(handleScrollToBus)()
        }}
        fadingEdgeLength={40}
        drawDistance={1}
        ListEmptyComponent={<UiActivityIndicator color={schemeColor.onSurface} />}
        {...(Platform.OS !== 'web'
          ? {
              onViewableItemsChanged: ({ viewableItems }) => {
                currentViewableItems.current = viewableItems
              },
            }
          : {})}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingVertical: 4,
    paddingRight: 8,
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
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
