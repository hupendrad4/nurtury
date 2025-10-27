'use client';

interface FilterChip {
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: FilterChip[];
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
      {filters.map((filter, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1.5 text-sm"
        >
          <span className="text-gray-700">{filter.label}</span>
          <button
            onClick={filter.onRemove}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-primary hover:text-primary-dark font-medium underline ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

