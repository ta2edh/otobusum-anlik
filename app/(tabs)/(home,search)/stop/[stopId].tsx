import { getBussesInStop } from '@/api/getBussesInStop'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { TheMap } from '@/components/TheMap'
import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { useQuery } from '@tanstack/react-query'

import { useLocalSearchParams } from 'expo-router'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useEffect } from 'react'

const MAP_COLLAPSED = 150
const MAP_EXPANDED = 100

export default function StopDetails() {
  const { stopId } = useLocalSearchParams<{ stopId: string }>()
  const { colorsTheme } = useTheme()
  const scrollY = useSharedValue(0)

  const query = useQuery({
    queryKey: ['busses-in-stop', stopId],
    queryFn: () => getBussesInStop(stopId),
    staleTime: 60_000 * 30,
  })

  useEffect(() => {
    if (!query.data) return
    // TODO: Animate to bus stop coordinates here.
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
        <TheMap />
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
              <View style={[styles.codeOuter, { backgroundColor: colorsTheme.surfaceContainerLow }]}>
                {query.data?.map(lineCode => (
                  <View key={lineCode} style={[styles.code, lineCodeStyle]}>
                    <UiText>{lineCode}</UiText>
                  </View>
                ))}
              </View>
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
    padding: 8,
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
