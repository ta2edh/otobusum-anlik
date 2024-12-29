import { memo, useMemo, useState } from 'react'
import { ScrollView, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSegmentedButtons } from '@/components/ui/UiSegmentedButtons'
import { UiText } from '@/components/ui/UiText'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'
import { useLine } from '@/hooks/queries/useLine'
import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTimetable } from '@/hooks/queries/useTimetable'
import { useTheme } from '@/hooks/useTheme'

import { useFiltersStore } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { charactersToAscii } from '@/utils/charactersToAscii'
import { groupDeparturesByHour } from '@/utils/groupDeparturesByHour'

interface Props {
  lineCode: string
}

export const LineTimetable = ({ lineCode }: Props) => {
  const now = new Date()
  const day = now.getDay()

  const defaultDayType = day === 6
    ? 'C'
    : day === 0
      ? 'P'
      : 'I'

  const [dayType, setDayType] = useState(() => defaultDayType)

  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  useFiltersStore(useShallow(state => state.selectedCity))

  const { getSchemeColorHex } = useTheme(lineTheme)

  const { query: announcementsQuery } = useAnnouncements()
  const { routeCode, getRouteFromCode } = useRoutes(lineCode)

  const route = getRouteFromCode()
  const [leftTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

  const { lineWidth } = useLine(lineCode)
  const { query } = useTimetable(lineCode)

  const filteredData = useMemo(
    () => {
      if (!query.data) return []

      if (dayType === 'C') {
        return query.data.saturday
      }

      if (dayType === 'P') {
        return query.data.sunday
      }

      // for weekdays going to merge all weekday days
      const timesSet = new Set([
        ...query.data.monday,
        ...query.data.tuesday,
        ...query.data.wednesday,
        ...query.data.thursday,
        ...query.data.friday,
      ])

      return Array.from(timesSet)
    },
    [query.data, dayType],
  )

  const announcements = useMemo(
    () => {
      return announcementsQuery.data?.filter(
        ann => ann.HATKODU = lineCode,
      ) || []
    },
    [announcementsQuery.data, lineCode],
  )

  const cancelledTimes = useMemo(
    () => announcements.map(
      (ann) => {
        if (!ann.MESAJ.includes('dan Saat')) return

        const msgSplit = ann.MESAJ.split('dan Saat')
        const from = msgSplit.at(0)
        if (!from) return

        const tLeftTitle = leftTitle ? charactersToAscii(leftTitle) : undefined
        if (from.trim() !== tLeftTitle?.trim()) return

        const time = msgSplit.at(1)?.split('de hareket etmesi planlanan').at(0)?.trim()
        return time
      },
    ),
    [announcements, leftTitle],
  )

  const groupedByHour = groupDeparturesByHour(filteredData)
  const hours = Object.keys(groupedByHour).sort()

  const containerStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('primary'),
    backgroundColor: getSchemeColorHex('primary'),
    width: lineWidth,
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  const cellStyle: StyleProp<TextStyle> = {
    backgroundColor: getSchemeColorHex('primaryContainer'),
    color: getSchemeColorHex('onPrimaryContainer'),
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View>
        <UiText style={textStyle}>
          {routeCode}
          {' '}
          -
          {lineCode}
        </UiText>
        <UiText style={[styles.title, textStyle]}>
          {route?.route_long_name.trim()}
        </UiText>
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
            {hours.map(hour => (
              <View key={hour} style={styles.row}>
                {groupedByHour[hour]?.map(time => (
                  <UiText
                    key={`${lineCode}-${time}-${routeCode}`}
                    style={[
                      styles.cell,
                      textStyle,
                      cancelledTimes.includes(`${hour}:${time}`) && {
                        textDecorationLine: 'line-through',
                        opacity: 0.5,
                      },
                    ]}
                  >
                    {time}
                  </UiText>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  )
}

export const LineTimetableMemoized = memo(LineTimetable)

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
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
