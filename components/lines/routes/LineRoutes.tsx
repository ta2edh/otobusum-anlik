import { BottomSheetFlashList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { memo, useCallback, useRef } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'

import { UiSheetModal } from '../../ui/sheet/UiSheetModal'
import { UiButton } from '../../ui/UiButton'
import { UiText } from '../../ui/UiText'

import { LineRoute } from '@/api/getAllRoutes'
import { colors } from '@/constants/colors'
import { selectRoute, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

interface Props {
  code: string
}

interface ItemProps extends Props {
  item: LineRoute
}

const LineRoutesItem = (props: ItemProps) => {
  const selectedRouteCode = useFiltersStore(useShallow(state => state.selectedRoutes[props.code]))
  const isSelected = selectedRouteCode === props.item.route_code

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary,
  }

  const handlePress = () => {
    if (props.item.route_code) {
      selectRoute(props.code, props.item.route_code)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.item, isSelected ? selectedStyle : undefined]}
      onPress={handlePress}
    >
      <UiText>{`${props.item.route_code} ${props.item.route_long_name}`}</UiText>
    </TouchableOpacity>
  )
}

export const LineRoutes = memo(function LineRoutes(props: Props) {
  const { query: allRoutes, getRouteFromCode } = useRoutes(props.code)
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

  const renderItem = useCallback(
    ({ item }: { item: LineRoute }) => {
      return <LineRoutesItem code={props.code} item={item} />
    },
    [props.code],
  )

  const defaultRoutes = () => {
    return (
      <View>
        {routesDefaults.map(item => (
          <LineRoutesItem key={item.id} code={props.code} item={item} />
        ))}
      </View>
    )
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

      <UiSheetModal
        ref={bottomSheetModal}
        snapPoints={['50%']}
        enableDynamicSizing={false}
      >
        <UiText info style={styles.title}>
          {i18n.t('routes')}
        </UiText>

        <BottomSheetFlashList
          data={routesfiltered}
          renderItem={renderItem}
          keyExtractor={item => item.route_code?.toString() || ''}
          estimatedItemSize={35}
          ListHeaderComponent={defaultRoutes}
        />
      </UiSheetModal>
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
