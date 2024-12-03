import { useQuery } from '@tanstack/react-query'
import { memo, useMemo, useState } from 'react'
import { ScrollView, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useAnnouncements } from '@/hooks/useAnnouncements'
import { useRoutes } from '@/hooks/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './ui/UiActivityIndicator'
import { UiSegmentedButtons } from './ui/UiSegmentedButtons'
import { UiText } from './ui/UiText'

import { PlannedDeparture, getPlannedDepartures } from '@/api/getPlannedDepartures'
import { useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { DayType } from '@/types/departure'
import { charactersToAscii } from '@/utils/charactersToAscii'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'

function groupDeparturesByHour(obj: PlannedDeparture[]) {
  const res: Record<string, PlannedDeparture[]> = {}

  for (let index = 0; index < obj.length; index++) {
    const element = obj[index]
    const hour = element?.['DT'].split(':').at(0)

    if (!hour || !element) continue

    if (!res[hour]) {
      res[hour] = [element]
    } else {
      res[hour].push(element)
    }
  }

  return res
}

interface Props {
  code: string
}

export const LineTimetable = (props: Props) => {
  const now = new Date()
  const day = now.getDay()

  const defaultDayType: DayType = day === 6
    ? 'C'
    : day === 0
      ? 'P'
      : 'I'

  const [dayType, setDayType] = useState<DayType>(() => defaultDayType)

  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.code]))

  const { query: announcementsQuery } = useAnnouncements()
  const { routeCode, getRouteFromCode } = useRoutes(props.code)

  const { getSchemeColorHex } = useTheme(lineTheme)

  const query = useQuery({
    queryKey: [`timetable-${props.code}`],
    queryFn: () => getPlannedDepartures(props.code),
  })

  const direction = extractRouteCodeDirection(routeCode)
  const route = getRouteFromCode()

  const [leftTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

  const filteredData = useMemo(
    () => query.data?.filter((item) => {
      const dir = direction ? item.SYON === direction : true
      return dir && item.SGUNTIPI === dayType
    }),
    [dayType, direction, query.data],
  )

  const announcements = useMemo(
    () => announcementsQuery.data?.filter((ann) => {
      return ann.HATKODU === props.code
    }),
    [announcementsQuery.data, props.code],
  )

  if (!query.data) {
    return <UiActivityIndicator />
  }

  const cancelledHours = announcements
    ? announcements.map((ann) => {
      if (!ann.MESAJ.includes('dan Saat')) return

      const msgSplit = ann.MESAJ.split('dan Saat')
      const from = msgSplit.at(0)
      if (!from) return

      const tLeftTitle = leftTitle ? charactersToAscii(leftTitle) : undefined
      const isDirectionTrue = from.trim() === tLeftTitle?.trim()
      if (!isDirectionTrue) return

      const hour = msgSplit.at(1)?.split('de hareket etmesi planlanan').at(0)?.trim()
      return hour
    })
    : []

  const groupedByHour = groupDeparturesByHour(filteredData || [])
  const hours = Object.keys(groupedByHour).sort()

  const containerStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('primary'),
    backgroundColor: getSchemeColorHex('primary'),
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  const cellStyle: StyleProp<TextStyle> = {
    backgroundColor: getSchemeColorHex('primaryContainer'),
    color: getSchemeColorHex('onPrimaryContainer'),
  }

  const title = query.data.at(0)?.HATADI

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View>
        <UiText style={textStyle}>
          {routeCode}
          {' '}
          -
          {props.code}
        </UiText>
        <UiText style={[styles.title, textStyle]}>{title}</UiText>
      </View>

      <View style={styles.filters}>
        <UiSegmentedButtons
          value={dayType}
          onValueChange={setDayType}
          style={{ flexGrow: 1 }}
          theme={lineTheme}
          buttons={[
            {
              value: 'I',
              label: i18n.t('workday'),
            },
            {
              value: 'C',
              label: i18n.t('saturday'),
            },
            {
              value: 'P',
              label: i18n.t('sunday'),
            },
          ]}
        />
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.innerScroll} fadingEdgeLength={40}>
          <View style={styles.fixed}>
            {hours.map(hour => (
              <UiText key={hour} style={[styles.cell, cellStyle]}>
                {hour}
              </UiText>
            ))}
          </View>

          <ScrollView contentContainerStyle={{ flexDirection: 'column', gap: 4 }} horizontal>
            {hours.map((hour) => {
              return (
                <View key={hour} style={styles.row}>
                  {groupedByHour[hour]?.map(departure => (
                    <UiText
                      key={`${props.code}-${departure.SSERVISTIPI}-${
                        departure.SGUZERAH
                      }-${hour}-${departure.DT.split(':').at(-1)}`}
                      style={[
                        styles.cell,
                        textStyle,
                        cancelledHours.includes(departure.DT) && {
                          textDecorationLine: 'line-through',
                          opacity: 0.5,
                        },
                      ]}
                    >
                      {departure.DT.split(':').at(-1)}
                    </UiText>
                  ))}
                </View>
              )
            })}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  )
}

export const LineTimetableMemoized = memo(LineTimetable)

const styles = StyleSheet.create({
  wrapper: {
    padding: 14,
    gap: 8,
    borderRadius: 8,
    flexShrink: 1,
  },
  container: {
    flexShrink: 1,
  },
  innerScroll: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  fixed: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
  },
})
