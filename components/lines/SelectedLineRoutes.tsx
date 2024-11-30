import { BottomSheetFlashList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { memo, useCallback, useRef } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useRouteFilter } from '@/hooks/useRouteFilter'

import { UiSheetModal } from '../ui/sheet/UiSheetModal'
import { UiButton, UiButtonProps } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { LineRoute } from '@/api/getAllRoutes'
import { colors } from '@/constants/colors'
import { selectRoute, useFilters } from '@/stores/filters'
import { i18n } from '@/translations/i18n'

type MergedProps = TouchableOpacityProps & UiButtonProps
interface Props extends MergedProps {
  code: string
}

interface ItemProps extends Props {
  item: LineRoute
}

function SelectedLineRoutesItem(props: ItemProps) {
  const selectedRouteCode = useFilters(useShallow(state => state.selectedRoutes[props.code]))
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
      style={[styles.item, props.style, isSelected ? selectedStyle : undefined]}
      onPress={handlePress}
    >
      <UiText>{`${props.item.route_code} ${props.item.route_long_name}`}</UiText>
    </TouchableOpacity>
  )
}

export const SelectedLineRoutes = memo(function SelectedLineRoutes(props: Props) {
  const { query: routes, getCurrentOrDefaultRoute } = useRouteFilter(props.code)

  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const route = getCurrentOrDefaultRoute()

  const routesfiltered: LineRoute[] = []
  const routesDefaults: LineRoute[] = []

  for (let index = 0; index < (routes.data?.result.records.length || 0); index++) {
    const element = routes.data?.result.records[index]
    if (!element) continue

    if (element.route_code && element.route_code?.endsWith('D0')) {
      routesDefaults.push(element)
    } else {
      routesfiltered.push(element)
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: LineRoute }) => {
      return <SelectedLineRoutesItem code={props.code} item={item} />
    },
    [props.code],
  )

  const defaultRoutes = () => {
    return (
      <View>
        {routesDefaults.map(item => (
          <SelectedLineRoutesItem key={item._id} code={props.code} item={item} />
        ))}
      </View>
    )
  }

  return (
    <>
      <UiButton
        title={route?.route_long_name}
        style={props.style}
        onPress={() => bottomSheetModal.current?.present()}
        {...props}
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
})
