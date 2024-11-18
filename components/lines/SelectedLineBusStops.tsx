import { useLineBusStops } from '@/hooks/useLineBusStops'
import { BusStopLocation } from '@/api/getLineBusStopLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { Ionicons } from '@expo/vector-icons'
import { getRouteDirection } from '@/utils/getRouteDirection'

import { StyleSheet, View, ViewStyle, FlatList } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UiText } from '../ui/UiText'
import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import Animated, {
  FadeIn,
  FadeOut,
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
// import { FlashList, FlashListProps, ListRenderItem, ViewToken } from '@shopify/flash-list'
import { Location } from '@/api/getLineBusLocations'
import { UiButton } from '../ui/UiButton'

interface Props {
  code: string
  routeCode?: string
}

const AnimatedFlashList
  = Animated.createAnimatedComponent<FlashListProps<BusStopLocation>>(FlashList)

const first = [{ boylam: '29.3115398333333', enlem: '40.8148838333333', guzergahkodu: 'KM12_G_D1255', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'O3260', son_konum_zamani: '2024-11-18 19:32:59', yakinDurakKodu: '207752', yon: 'KARTAL METRO' }, { boylam: '29.2947455', enlem: '40.8528901666667', guzergahkodu: 'KM12_G_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'O3227', son_konum_zamani: '2024-11-18 19:33:00', yakinDurakKodu: '260671', yon: 'KARTAL METRO' }, { boylam: '29.221733', enlem: '40.8990015', guzergahkodu: 'KM12_D_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'C-332', son_konum_zamani: '2024-11-18 19:32:52', yakinDurakKodu: '208312', yon: 'DENİZ HARP OKULU' }, { boylam: '29.2597445', enlem: '40.879195', guzergahkodu: 'KM12_G_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'C-330', son_konum_zamani: '2024-11-18 19:33:00', yakinDurakKodu: '225782', yon: 'KARTAL METRO' }, { boylam: '29.3062303333333', enlem: '40.8144346666667', guzergahkodu: 'KM12_D_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'O3226', son_konum_zamani: '2024-11-18 19:32:52', yakinDurakKodu: '225902', yon: 'DENİZ HARP OKULU' }, { boylam: '29.265947', enlem: '40.81394', guzergahkodu: 'KM12_G_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'C-331', son_konum_zamani: '2024-11-18 19:32:59', yakinDurakKodu: '225981', yon: 'KARTAL METRO' }]
const second = [{ boylam: '29.313784', enlem: '40.8172515', guzergahkodu: 'KM12_G_D1255', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'O3260', son_konum_zamani: '2024-11-18 19:33:50', yakinDurakKodu: '207752', yon: 'KARTAL METRO' }, { boylam: '29.2914235', enlem: '40.8558795', guzergahkodu: 'KM12_G_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'O3227', son_konum_zamani: '2024-11-18 19:33:53', yakinDurakKodu: '225831', yon: 'KARTAL METRO' }, { boylam: '29.2279961666667', enlem: '40.8948158333333', guzergahkodu: 'KM12_D_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'C-332', son_konum_zamani: '2024-11-18 19:33:55', yakinDurakKodu: '212842', yon: 'DENİZ HARP OKULU' }, { boylam: '29.2534311666667', enlem: '40.8812626666667', guzergahkodu: 'KM12_G_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'C-330', son_konum_zamani: '2024-11-18 19:33:54', yakinDurakKodu: '212572', yon: 'KARTAL METRO' }, { boylam: '29.2995706666667', enlem: '40.8165325', guzergahkodu: 'KM12_D_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'O3226', son_konum_zamani: '2024-11-18 19:33:55', yakinDurakKodu: '206372', yon: 'DENİZ HARP OKULU' }, { boylam: '29.265947', enlem: '40.81394', guzergahkodu: 'KM12_G_D0', hatad: 'TUZLA DENİZ HARP OKULU - KARTAL METRO', hatkodu: 'KM12', kapino: 'C-331', son_konum_zamani: '2024-11-18 19:33:52', yakinDurakKodu: '225981', yon: 'KARTAL METRO' }]

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

  // const line = useLines(useShallow(state => state.lines[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { query } = useLineBusStops(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const [selectFirst, setSelectFirst] = useState(false)
  const line = selectFirst ? first : second

  const busses = line?.filter(bus => bus.guzergahkodu === props.routeCode)
  const direction = props.routeCode ? getRouteDirection(props.routeCode) : 'G'
  const filtered = query.data?.filter(stop => stop.yon === direction)

  const scrollToTrackedBus = () => {
    console.log(currentTrackedBus)
    if (!currentTrackedBus.current) return

    const updatedBus = busses?.find(bus => bus.kapino === currentTrackedBus.current?.kapino)
    if (!updatedBus) return

    const stopIndex = filtered?.findIndex(
      stop => stop.durakKodu === updatedBus.yakinDurakKodu,
    )

    if (stopIndex === undefined || stopIndex === -1) {
      currentTrackedBus.current = undefined
    }
    else {
      flashlistRef.current?.scrollToIndex({
        animated: true,
        index: stopIndex,
        // viewPosition: 0.5,
        // viewOffset: containerHeight.value === EXPANDED ? 0 : ITEM_SIZE,
      })
    }
  }

  useEffect(() => {
    scrollToTrackedBus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line])

  const snapToBus = () => {
    console.log('snap to bus')

    if (isScrolling.value) return

    const trackedBus = busses?.find((bus) => {
      return currentViewableItems.current.find(
        ({ item }: { item: BusStopLocation }) => {
          return item.durakKodu === bus.yakinDurakKodu
        },
      )
    })

    if (!trackedBus) {
      currentTrackedBus.current = undefined
    }
    else {
      currentTrackedBus.current = trackedBus
      scrollToTrackedBus()
    }

    setTimeout(() => {
      scrollYStart.value = scrollY.value
      containerHeight.value = withDelay(1000, withTiming(COLLAPSED))
    }, 500)
  }

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    }
  }, [])

  useAnimatedReaction(
    () => containerHeight.value,
    () => {
      if (isScrolling.value) return
      // const interpolated = interpolate(
      //   containerHeight.value,
      //   [EXPANDED, COLLAPSED],
      //   [0, EXPANDED - COLLAPSED],
      // )

      // scrollTo(flashlistRef, 0, scrollYStart.value + interpolated / 2, true)
    },
    [isScrolling],
  )

  useAnimatedReaction(
    () => isScrolling.value,
    () => {
      if (!isScrolling.value) {
        runOnJS(snapToBus)()
      }
    },
    [snapToBus],
  )

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y
  }, [])

  const renderItem: ListRenderItem<BusStopLocation> = useCallback(
    ({ item }) => {
      const closestBus = busses?.find(bus => bus.yakinDurakKodu === item.durakKodu)

      const colorStyle: ViewStyle = {
        borderColor: getSchemeColorHex('primaryContainer'),
        backgroundColor: closestBus ? getSchemeColorHex('primaryContainer') : undefined,
      }

      return (
        <View style={styles.item}>
          <Animated.View exiting={FadeOut} entering={FadeIn} style={[styles.itemCircle, colorStyle]}>
            {closestBus && (
              <Ionicons
                name="bus-outline"
                color={getSchemeColorHex('onPrimaryContainer')}
                size={20}
              />
            )}
          </Animated.View>

          <UiText style={{ color: getSchemeColorHex('onPrimary') }} numberOfLines={1}>
            {item.durakAdi}
          </UiText>
        </View>
      )
    },
    [busses, getSchemeColorHex],
  )

  const handleScrollDragStart = () => {
    isScrolling.value = true
    containerHeight.value = withTiming(EXPANDED)
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
    <>
      <UiButton onPress={(() => setSelectFirst(state => !state))} title="change data" />
      <Animated.View style={animatedContainerStyle}>
        <AnimatedFlashList
          ref={flashlistRef}
          data={filtered}
          renderItem={renderItem}
          estimatedItemSize={ITEM_SIZE}
          keyExtractor={item => item.durakKodu}
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
    </>

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
