type Sizes = 'sm' | 'md' | 'lg'

export type FontSize = Sizes | 'xl'
export type IconSize = Sizes

export type ButtonVariants = 'solid' | 'soft' | 'ghost'

export const iconSizes: Record<IconSize, number> = {
  sm: 16,
  md: 18,
  lg: 24,
}

export const fontSizes: Record<FontSize, number> = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 22,
}
