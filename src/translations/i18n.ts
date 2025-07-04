import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import ar from '@/translations/ar'
import az from '@/translations/az'
import bg from '@/translations/bg'
import bo from '@/translations/bo'
import bs from '@/translations/bs'
import ca from '@/translations/ca'
import cs from '@/translations/cs'
import da from '@/translations/da'
import el from '@/translations/el'
import de from '@/translations/de'
import en from '@/translations/en'
import es from '@/translations/es'
import et from '@/translations/et'
import fa from '@/translations/fa'
import fi from '@/translations/fi'
import fr from '@/translations/fr'
import ga from '@/translations/ga'
import he from '@/translations/he'
import hi from '@/translations/hi'
import hr from '@/translations/hr'
import hu from '@/translations/hu'
import id from '@/translations/id'
import is from '@/translations/is'
import it from '@/translations/it'
import ja from '@/translations/ja'
import ka from '@/translations/ka'
import kk from '@/translations/kk'
import ko from '@/translations/ko'
import ky from '@/translations/ky'
import lb from '@/translations/lb'
import lo from '@/translations/lo'
import lt from '@/translations/lt'
import lv from '@/translations/lv'
import mk from '@/translations/mk'
import mn from '@/translations/mn'
import ms from '@/translations/ms'
import nb from '@/translations/nb'
import nl from '@/translations/nl'
import pl from '@/translations/pl'
import pt from '@/translations/pt'
import ro from '@/translations/ro'
import ru from '@/translations/ru'
import sk from '@/translations/sk'
import sq from '@/translations/sq'
import sr from '@/translations/sr'
import sv from '@/translations/sv'
import th from '@/translations/th'
import tk from '@/translations/tk'
import tr from '@/translations/tr'
import tt from '@/translations/tt'
import ug from '@/translations/ug'
import uk from '@/translations/uk'
import ur from '@/translations/ur'
import uz from '@/translations/uz'
import vi from '@/translations/vi'
import zhHans from '@/translations/zh-Hans'
import zhHant from '@/translations/zh-Hant'
import zhHK from '@/translations/zh-HK'

export const i18n = new I18n({ 
  ar, 
  az,
  bg,
  bo,
  bs,
  ca,
  cs,
  da,
  el,
  de, 
  en,
  es,
  et,
  fa,
  fi,
  fr,
  ga,
  he,
  hi,
  hr,
  hu,
  id,
  is,
  it,
  ja,
  ka,
  kk,
  ko,
  ky,
  lb,
  lo,
  lt,
  lv,
  mk,
  mn,
  ms,
  nb,
  nl,
  pl,
  pt,
  ro,
  ru,
  sk,
  sq,
  sr,
  sv,
  th,
  tk,
  tr,
  tt,
  ug,
  uk,
  ur,
  uz,
  vi,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  'zh-HK': zhHK,
})

// Set the locale automatically based on device language
// According to Expo's localization guide
export const deviceLocales = getLocales()
export const deviceLanguage = deviceLocales[0]?.languageCode || 'en'
export const deviceRegion = deviceLocales[0]?.regionCode || null

// Automatically use device language
i18n.locale = deviceLanguage
i18n.enableFallback = true
i18n.defaultLocale = 'en'

// Güvenli çeviri fonksiyonu - undefined döndürmez
export const safeTranslate = (key: string, options?: any): string => {
  try {
    const result = i18n.t(key, options)
    return result || key || ''
  } catch (error) {
    console.warn('Translation error for key:', key, error)
    return key || ''
  }
}
