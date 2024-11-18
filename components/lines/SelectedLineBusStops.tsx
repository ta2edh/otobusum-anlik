import { useLineBusStops } from '@/hooks/useLineBusStops'
import { BusStopLocation } from '@/api/getLineBusStopLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { Ionicons } from '@expo/vector-icons'
import { getRouteDirection } from '@/utils/getRouteDirection'

import { StyleSheet, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useCallback, useEffect, useRef } from 'react'
import { UiText } from '../ui/UiText'
import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import Animated, {
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { FlashList, FlashListProps, ListRenderItem, ViewToken } from '@shopify/flash-list'
import { Location } from '@/api/getLineBusLocations'

interface Props {
  code: string
  routeCode?: string
}

const AnimatedFlashList
  = Animated.createAnimatedComponent<FlashListProps<BusStopLocation>>(FlashList)

const ITEM_SIZE = 46
const COLLAPSED = ITEM_SIZE * 3 - (ITEM_SIZE / 2) * 2
const EXPANDED = COLLAPSED * 2

export function SelectedLineBusStops(props: Props) {
  const flashlistRef = useAnimatedRef<FlashList<BusStopLocation>>()
  const currentViewableItems = useRef<ViewToken[]>([])

  const currentTrackedBus = useRef<Location>()
  const containerHeight = useSharedValue(COLLAPSED)
  const isScrolling = useSharedValue(false)
  const scrollY = useSharedValue(0)
  const scrollYStart = useSharedValue(0)

  const line = useLines(useShallow(state => state.lines[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { query } = useLineBusStops(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const busses = line?.filter(bus => bus.guzergahkodu === props.routeCode)
  const direction = props.routeCode ? getRouteDirection(props.routeCode) : 'G'
  const filtered = query.data?.filter(stop => stop.yon === direction)

  const scrollToTrackedBus = useCallback(() => {
    const stopIndex = filtered?.findIndex(
      stop => stop.durakKodu === currentTrackedBus.current?.yakinDurakKodu,
    )

    console.log(currentTrackedBus.current, stopIndex)

    if (stopIndex === undefined) {
      currentTrackedBus.current = undefined
    }
    else {
      flashlistRef.current?.scrollToIndex({
        index: stopIndex,
        animated: true,
        viewPosition: 0.5,
      })
    }
  }, [filtered, flashlistRef])

  useEffect(() => {
    scrollToTrackedBus()
  }, [scrollToTrackedBus])

  const snapToBus = () => {
    if (isScrolling.value) return

    const trackedBus = busses?.find(bus =>
      currentViewableItems.current.find(
        ({ item }: { item: BusStopLocation }) => item.durakKodu === bus.yakinDurakKodu,
      ),
    )

    currentTrackedBus.current = trackedBus
    scrollToTrackedBus()

    setTimeout(() => {
      scrollYStart.value = scrollY.value
      containerHeight.value = withDelay(1000, withTiming(COLLAPSED))
    }, 500)
  }

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    }
  })

  useAnimatedReaction(
    () => containerHeight.value,
    () => {
      if (isScrolling.value) return

      const interpolated = interpolate(
        containerHeight.value,
        [EXPANDED, COLLAPSED],
        [0, EXPANDED - COLLAPSED],
      )
      scrollTo(flashlistRef, 0, scrollYStart.value + interpolated / 2, true)
    },
  )

  useAnimatedReaction(
    () => isScrolling.value,
    () => {
      if (!isScrolling.value) {
        runOnJS(snapToBus)()
      }
    },
  )

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y
  })

  const renderItem: ListRenderItem<BusStopLocation> = useCallback(
    ({ item }) => {
      const closestBus = busses?.find(bus => bus.yakinDurakKodu === item.durakKodu)

      const colorStyle: ViewStyle = {
        borderColor: getSchemeColorHex('primaryContainer'),
        backgroundColor: closestBus ? getSchemeColorHex('primaryContainer') : undefined,
      }

      return (
        <View style={styles.item}>
          <View style={[styles.itemCircle, colorStyle]}>
            {closestBus && (
              <Ionicons
                name="bus-outline"
                color={getSchemeColorHex('onPrimaryContainer')}
                size={20}
              />
            )}
          </View>

          <UiText style={{ color: getSchemeColorHex('onPrimary') }} numberOfLines={1}>
            {item.durakAdi}
          </UiText>
        </View>
      )
    },
    [busses, getSchemeColorHex],
  )

  const handleScrollDragStart = () => {
    console.log('drag start')

    isScrolling.value = true
    containerHeight.value = withTiming(EXPANDED)

    // currentTrackedBus.current = undefined
  }

  const handleScrollMomentumEnd = () => {
    isScrolling.value = false
  }

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    currentViewableItems.current = viewableItems
  }

  if (query.isPending) {
    return <UiActivityIndicator />
  }

  if (!filtered) {
    return null
  }

  const overrideItemLayout = (layout: { size?: number }): void => {
    layout.size = ITEM_SIZE
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      <AnimatedFlashList
        ref={flashlistRef}
        data={filtered}
        renderItem={renderItem}
        estimatedItemSize={ITEM_SIZE}
        overrideItemLayout={overrideItemLayout}
        fadingEdgeLength={40}
        onScrollBeginDrag={handleScrollDragStart}
        onMomentumScrollEnd={handleScrollMomentumEnd}
        onViewableItemsChanged={handleViewableItemsChanged}
        onScroll={handleOnScroll}
        viewabilityConfig={{
          minimumViewTime: 200,
          waitForInteraction: true,
          itemVisiblePercentThreshold: 100,
        }}
        snapToInterval={ITEM_SIZE}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  itemCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
