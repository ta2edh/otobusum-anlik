import { memo, useMemo, useState } from 'react'
import { ScrollView, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'
import { useLine } from '@/hooks/queries/useLine'
import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTimetable } from '@/hooks/queries/useTimetable'
import { useTheme } from '@/hooks/useTheme'

import { UiSegmentedButtons } from './ui/UiSegmentedButtons'
import { UiText } from './ui/UiText'

import { useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { DayType } from '@/types/departure'
import { charactersToAscii } from '@/utils/charactersToAscii'
import { extractRouteCodeDirection } from '@/utils/extractRouteCodeDirection'
import { groupDeparturesByHour } from '@/utils/groupDeparturesByHour'

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
  const { query } = useTimetable(props.code)
  const { lineWidth } = useLine(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)

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
    width: lineWidth,
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  const cellStyle: StyleProp<TextStyle> = {
    backgroundColor: getSchemeColorHex('primaryContainer'),
    color: getSchemeColorHex('onPrimaryContainer'),
  }

  const title = query.data?.at(0)?.HATADI

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
