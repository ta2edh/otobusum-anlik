import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useLine } from '@/hooks/useLine'
import { useTheme } from '@/hooks/useTheme'

import { MarkerLazyCallout } from './MarkerLazyCallout'

import { BusLocation } from '@/api/getLineBusLocations'
import { colors } from '@/constants/colors'
import { getRoute, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

interface Props {
  code: string
}

interface LineBusMarkersItemProps {
  location: BusLocation
  lineCode: string
}

export const LineBusMarkersItem = memo(function LineBusMarkersItem({
  location,
  lineCode,
}: LineBusMarkersItemProps) {
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[lineCode]))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

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
          <View style={styles.calloutContainer}>
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
})

export const LineBusMarkers = memo(function LineBusMarkers(props: Props) {
  const {
    query: { data: line },
  } = useLine(props.code)
  const routeCode = useFiltersStore(() => getRoute(props.code))

  const filtered = line?.filter(loc => loc.guzergahkodu === routeCode) || []

  return (
    <>
      {filtered?.map(loc => (
        <LineBusMarkersItem key={loc.kapino} location={loc} lineCode={props.code} />
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
  calloutContainer: {
    backgroundColor: colors.dark.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  },
})
