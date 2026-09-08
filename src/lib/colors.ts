// src/lib/colors.ts

export const COLORS = {
  copper: '#B8860B',
  copperLight: '#D4AF37',
  copperDark: '#8B6914',
  black: '#1A1A1A',
  white: '#FFFFFF',
  grayLight: '#F5F5F5',
  success: '#4CAF50',
  warning: '#FF6B35',
  error: '#E74C3C',
  info: '#1A3A52',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
}

export const CATEGORY_COLORS: Record<string, string> = {
  louvor: '#B8860B',
  pregacao: '#D4AF37',
  comunidade: '#1A3A52',
  crescimento: '#4CAF50',
}

export function getCategoryColor(categoryId: string): string {
  return CATEGORY_COLORS[categoryId] || COLORS.copper
}