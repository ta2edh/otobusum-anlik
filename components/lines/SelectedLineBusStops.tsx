import { useLineBusStops } from '@/hooks/useLineBusStops'
import { BusStopLocation } from '@/api/getLineBusStopLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { Ionicons } from '@expo/vector-icons'
import { getRouteDirection } from '@/utils/getRouteDirection'

import { StyleProp, StyleSheet, TextStyle, View, ViewStyle, ListRenderItem } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useMemo } from 'react'
import { UiText } from '../ui/UiText'
import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

interface Props {
  code: string
  routeCode?: string
}

export function SelectedLineBusStops(props: Props) {
  const line = useLines(useShallow(state => state.lines[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { query } = useLineBusStops(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)
  const containerHeight = useSharedValue(100)

  const busses = line?.filter(bus => bus.guzergahkodu === props.routeCode)
  const direction = props.routeCode ? getRouteDirection(props.routeCode) : 'G'
  const filtered = query.data?.filter(stop => stop.yon === direction).reverse()

  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: getSchemeColorHex('onPrimary'),
    }),
    [getSchemeColorHex],
  )

  const circleStyle: StyleProp<ViewStyle> = useMemo(() => ({
    borderColor: getSchemeColorHex('primaryContainer'),
    borderWidth: 2,
  }), [getSchemeColorHex])

  const renderItem: ListRenderItem<BusStopLocation> = ({ item }) => {
    const closestBusses = busses?.find(bus => bus.yakinDurakKodu === item.durakKodu)

    const fillStyle: ViewStyle | undefined = closestBusses
      ? {
          backgroundColor: getSchemeColorHex('primaryContainer'),
        }
      : undefined

    return (
      <View style={styles.item}>
        <View style={[styles.itemCircle, circleStyle, fillStyle]}>
          {closestBusses && (
            <Ionicons name="bus-outline" color={getSchemeColorHex('onPrimaryContainer')} size={20} />
          )}
        </View>

        <UiText style={textStyle} numberOfLines={1}>
          {item.durakAdi}
        </UiText>
      </View>
    )
  }

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }))

  if (query.isPending) {
    return <UiActivityIndicator />
  }

  if (!filtered) {
    return null
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      <Animated.FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.durakKodu}
        // estimatedItemSize={46}
        fadingEdgeLength={40}
        onScrollEndDrag={() => containerHeight.value = withDelay(2_500, withTiming(100))}
        onScrollBeginDrag={() => containerHeight.value = withTiming(200)}
        getItemLayout={(_, index) => ({ length: 46, offset: 46 * index, index })}
        // snapToInterval={46}
        // snapToAlignment="center"
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
    alignItems: 'center',
    justifyContent: 'center',
  },
})
