import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'

import { useTheme } from '@/hooks/useTheme'

import { i18n } from '@/translations/i18n'

type Icons = ComponentProps<typeof Ionicons>['name']

const getIconName = (icon: Icons, focused?: boolean) =>
  (focused ? `${icon}` : `${icon}-outline`) as ComponentProps<typeof Ionicons>['name']

const screens = [
  {
    name: 'index',
    label: 'map',
    icon: 'map',
  },
  {
    name: 'search',
    label: 'search',
    icon: 'search',
  },
  {
    name: 'timetable',
    label: 'timetable',
    icon: 'time',
  },
  {
    name: 'settings',
    label: 'settings',
    icon: 'settings',
  },
]

export const TabsLayout = () => {
  const { colorsTheme } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          flex: 1,
        },
        animation: 'shift',
        freezeOnBlur: true,
      }}
      detachInactiveScreens
    >
      {screens.map(screen => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarLabel: i18n.t(screen.label),
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={
                  (focused ? `${screen.icon}` : `${screen.icon}-outline`) as ComponentProps<
                    typeof Ionicons
                  >['name']
                }
                size={24}
                color={colorsTheme.color}
              />
            ),
          }}
        />
      ))}

      {/* <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: i18n.t('map'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getIconName('map', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: i18n.t('search'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getIconName('search', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarLabel: i18n.t('timetable'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getIconName('time', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: i18n.t('settings'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getIconName('settings', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      /> */}
    </Tabs>
  )
}

export default TabsLayout
