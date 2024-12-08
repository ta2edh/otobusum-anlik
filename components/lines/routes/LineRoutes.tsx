import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { memo, useRef } from 'react'
import {
  StyleSheet,
} from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetSelect } from '@/components/ui/sheet/UiSheetSelect'

import { useRoutes } from '@/hooks/queries/useRoutes'

import { UiButton } from '../../ui/UiButton'

import { LineRoute } from '@/api/getAllRoutes'
import { selectRoute, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

interface Props {
  code: string
}

export const LineRoutes = memo(function LineRoutes(props: Props) {
  const { query: allRoutes, getRouteFromCode } = useRoutes(props.code)

  const selectedRouteCode = useFiltersStore(useShallow(state => state.selectedRoutes[props.code]))
  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.code]))

  const route = getRouteFromCode()

  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const routesfiltered: LineRoute[] = []
  const routesDefaults: LineRoute[] = []

  for (let index = 0; index < (allRoutes.data?.length || 0); index++) {
    const element = allRoutes.data?.[index]
    if (!element) continue

    if (element.route_code && element.route_code?.endsWith('D0')) {
      routesDefaults.push(element)
    } else {
      routesfiltered.push(element)
    }
  }

  const merged = [...routesDefaults, ...routesfiltered].map(x => ({
    label: `${x.route_code} ${x.route_long_name}`,
    value: x,
  }))

  const selectedLineRoute = merged.find(m => m.value.route_code === selectedRouteCode)

  const handleOnSelect = (value: LineRoute) => {
    if (!value.route_code) return
    selectRoute(props.code, value.route_code)
  }

  return (
    <>
      <UiButton
        title={route?.route_long_name || ''}
        onPress={() => bottomSheetModal.current?.present()}
        theme={lineTheme}
        containerStyle={styles.grow}
        icon="git-branch-outline"
      />

      <UiSheetSelect
        cRef={bottomSheetModal}
        title={i18n.t('routes')}
        options={merged}
        onValueChange={handleOnSelect}
        value={selectedLineRoute?.value}
        list
      />
    </>
  )
})

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  title: {
    fontSize: 24,
    padding: 8,
  },
  grow: {
    flexGrow: 1,
  },
})
