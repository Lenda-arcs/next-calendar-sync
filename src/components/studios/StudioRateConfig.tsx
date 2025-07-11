'use client'

interface RateConfig {
  type?: 'flat' | 'per_student' | 'tiered'
  base_rate?: number
  rate_per_student?: number
  minimum_threshold?: number
  bonus_threshold?: number
  bonus_per_student?: number
  max_discount?: number
  tiers?: Array<{
    min: number
    max?: number
    rate: number
  }>
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
  currency?: string
}

interface StudioRateConfigProps {
  config: RateConfig | null
  compact?: boolean
}

export function StudioRateConfig({ config, compact = false }: StudioRateConfigProps) {
  if (!config) return null

  const currency = config.currency || 'EUR'
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'

  const getRateTypeLabel = (type?: string) => {
    switch (type) {
      case 'flat': return 'Flat Rate'
      case 'per_student': return 'Per Student' 
      case 'tiered': return 'Tiered'
      default: return 'Flat Rate'
    }
  }

  const getMainRate = () => {
    if (config.type === 'per_student') {
      return `${currencySymbol}${config.rate_per_student?.toFixed(2) || '0.00'}/student`
    }
    if (config.type === 'tiered') {
      return 'Tiered'
    }
    return `${currencySymbol}${config.base_rate?.toFixed(2) || '0.00'}`
  }

  if (compact) {
    return (
      <div className="text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">{getRateTypeLabel(config.type)}</span>
          <span className="font-mono text-gray-600">{getMainRate()}</span>
        </div>
        {config.online_bonus_per_student && (
          <div className="text-xs text-gray-500 mt-1">
            Online bonus: {currencySymbol}{config.online_bonus_per_student.toFixed(2)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Type: </span>
          <span className="text-gray-600">{getRateTypeLabel(config.type)}</span>
        </div>
        <div>
          <span className="font-medium">Rate: </span>
          <span className="text-gray-600 font-mono">{getMainRate()}</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        {/* Flat rate details */}
        {(config.type === 'flat' || !config.type) && (
          <>
            {config.minimum_threshold && (
              <div>• Min. students: {config.minimum_threshold}</div>
            )}
            {config.bonus_threshold && (
              <div>• Bonus threshold: {config.bonus_threshold} students</div>
            )}
            {config.bonus_per_student && (
              <div>• Bonus: {currencySymbol}{config.bonus_per_student.toFixed(2)}/student</div>
            )}
            {config.max_discount && (
              <div>• Max discount: {currencySymbol}{config.max_discount.toFixed(2)}</div>
            )}
          </>
        )}
        
        {/* Tiered rate details */}
        {config.type === 'tiered' && config.tiers && (
          <>
            <div className="font-medium">Tiers:</div>
            {config.tiers.map((tier, index) => (
              <div key={index} className="ml-2 flex justify-between">
                <span>{tier.min}{tier.max ? `-${tier.max}` : '+'} students:</span>
                <span className="font-mono">{currencySymbol}{tier.rate.toFixed(2)}</span>
              </div>
            ))}
          </>
        )}
        
        {/* Online bonus */}
        {config.online_bonus_per_student && (
          <div>
            • Online bonus: {currencySymbol}{config.online_bonus_per_student.toFixed(2)}/student
            {config.online_bonus_ceiling && ` (max ${config.online_bonus_ceiling})`}
          </div>
        )}
      </div>
    </div>
  )
} 