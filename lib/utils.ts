// Simple cn utility — no external dependencies
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  return inputs
    .filter(Boolean)
    .map(input => {
      if (typeof input === 'string') return input
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(' ')
      }
      return ''
    })
    .join(' ')
    .trim()
}

export function formatCurrency(value: number | null): string {
  if (value === null) return 'R$ —,—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatInstallment(value: number | null, installments = 12): string {
  if (value === null) return '—'
  const perInstallment = value / installments
  return `${installments}x de ${formatCurrency(perInstallment)} sem juros`
}
