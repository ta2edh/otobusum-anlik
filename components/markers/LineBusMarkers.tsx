import { memo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { i18n } from '@/translations/i18n'
import { UiText } from '@/components/ui/UiText'
import { useLines } from '@/stores/lines'
import { BusLocation } from '@/api/getLineBusLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLine } from '@/hooks/useLine'
import { Ionicons } from '@expo/vector-icons'
import { MarkerLazyCallout } from './MarkerLazyCallout'
import { getSelectedRouteCodeOrDefault } from '@/hooks/useRouteFilter'

interface Props {
  code: string
}

export const LineBusMarkersItem = function LineBusMarkersItem({
  location,
  lineCode,
}: {
  lineCode: string
  location: BusLocation
}) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[lineCode]))
  const { getSchemeColorHex, colorsTheme } = useTheme(lineTheme)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

  const calloutStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  }

  return (
    <MarkerLazyCallout
      coordinate={{
        latitude: parseFloat(location.enlem),
        longitude: parseFloat(location.boylam),
      }}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
      calloutProps={{
        children: (
          <View style={calloutStyle}>
            <View>
              <UiText>
                {location.hatkodu}
                {' '}
                -
                {location.hatad}
              </UiText>
              <UiText>
                {i18n.t('doorNo')}
                :
                {location.kapino}
              </UiText>
              <UiText>
                {i18n.t('direction')}
                :
                {location.yon}
              </UiText>
              <UiText>
                {i18n.t('lastUpdate')}
                :
                {location.son_konum_zamani}
              </UiText>
            </View>
          </View>
        ),
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>
    </MarkerLazyCallout>
  )
}

export const LineBusMarkers = memo(function LineBusMarkers(props: Props) {
  const { query: { data: line } } = useLine(props.code)

  const routeCode = getSelectedRouteCodeOrDefault(props.code)
  const filtered = line?.filter(loc => loc.guzergahkodu === routeCode)

  return (
    <>
      {filtered?.map(loc => (
        <LineBusMarkersItem
          key={loc.kapino}
          lineCode={props.code}
          location={loc}
        />
      ))}
    </>
  )
})

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 10,
    height: 10,
  },
})
