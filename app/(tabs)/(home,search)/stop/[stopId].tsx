import { getStop } from '@/api/getStop'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { TheMap } from '@/components/TheMap'
import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { useQuery } from '@tanstack/react-query'

import { useLocalSearchParams } from 'expo-router'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useEffect, useRef } from 'react'
import MapView from 'react-native-maps'

const MAP_COLLAPSED = 150
const MAP_EXPANDED = 100

export default function StopDetails() {
  const { stopId } = useLocalSearchParams<{ stopId: string }>()
  const { colorsTheme } = useTheme()
  const map = useRef<MapView>(null)
  const scrollY = useSharedValue(0)

  const query = useQuery({
    queryKey: ['stop', stopId],
    queryFn: () => getStop(stopId),
    staleTime: 60_000 * 30,
  })

  useEffect(() => {
    if (!query.data) return

    map.current?.animateCamera({
      center: {
        latitude: query.data.stop.y_coord,
        longitude: query.data.stop.x_coord,
      },
      zoom: 16,
    })
  }, [query.data])

  const lineCodeStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  const animatedStyle = useAnimatedStyle(() => ({
    height: MAP_EXPANDED + MAP_COLLAPSED,
    position: 'absolute',
    left: 0,
    right: 0,
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, MAP_EXPANDED],
        [0, -MAP_EXPANDED],
        'clamp',
      ),
    }],
  }))

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y
  })

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <TheMap ref={map} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        onScroll={handleOnScroll}
        contentContainerStyle={styles.content}
      >
        {query.isPending
          ? (
              <UiActivityIndicator size="large" />
            )
          : (
              <>
                <View>
                  <UiText>{query.data?.stop.stop_code}</UiText>
                  <UiText size="lg" style={styles.title}>{query.data?.stop.stop_name}</UiText>
                  <UiText>{query.data?.stop.province}</UiText>
                </View>

                <View style={[styles.codeOuter, { backgroundColor: colorsTheme.surfaceContainerLow }]}>
                  {query.data?.buses.map(lineCode => (
                    <View key={lineCode} style={[styles.code, lineCodeStyle]}>
                      <UiText>{lineCode}</UiText>
                    </View>
                  ))}
                </View>
              </>
            )}

      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: MAP_EXPANDED,
    marginTop: MAP_COLLAPSED,
  },
  content: {
    padding: 14,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  codeOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  code: {
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
})
