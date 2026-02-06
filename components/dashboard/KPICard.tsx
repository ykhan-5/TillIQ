import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercentage, getTrendArrow, getTrendColor } from '@/lib/utils/formatters';

export interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    value: number; // percentage
  };
  format?: 'currency' | 'number' | 'percentage';
}

export function KPICard({ label, value, trend, format = 'number' }: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
      default:
        return formatNumber(val);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{label}</p>
          <div className="mt-1 sm:mt-2 flex items-baseline justify-between gap-2">
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 truncate">
              {formatValue(value)}
            </p>
            {trend && (
              <div className={`flex items-center text-xs sm:text-sm font-medium flex-shrink-0 ${getTrendColor(trend.value)}`}>
                <span className="mr-0.5 sm:mr-1">{getTrendArrow(trend.direction)}</span>
                <span>{formatPercentage(trend.value, 1)}</span>
              </div>
            )}
          </div>
          {trend && (
            <p className="mt-1 text-[10px] sm:text-xs text-gray-500">vs previous period</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
