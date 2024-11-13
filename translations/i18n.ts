import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import en from '@/translations/en'
import tr from '@/translations/tr'

export const i18n = new I18n({ tr, en })
i18n.locale = getLocales()[0]?.languageCode || 'en'
i18n.enableFallback = true
