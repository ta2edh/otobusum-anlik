import { UiText } from '@/components/ui/UiText'
import { useLocalSearchParams } from 'expo-router'

export default function GroupEdit() {
  const params = useLocalSearchParams()
  console.log(params)

  return (
    <UiText>edit group name screen</UiText>
  )
}
