import { useTheme } from '@/hooks/useTheme'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors } from '@/constants/colors'
import { i18n } from '@/translations/i18n'

export default function TabLayout() {
  const { colorsTheme } = useTheme()

  const getName = (n: string, focused?: boolean): any => (focused ? `${n}` : `${n}-outline`)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorsTheme.surfaceContainerLow,
          borderColor: colorsTheme.surfaceContainer,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarShowLabel: false,
        // unmountOnBlur: true,
      }}
      sceneContainerStyle={{ backgroundColor: colorsTheme.surfaceContainerLow }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: i18n.t('map'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getName('map', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarLabel: i18n.t('timetable'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getName('time', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
    </Tabs>
  )
}
