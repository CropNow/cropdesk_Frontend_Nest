export const SQ_FT_PER_ACRE = 43560;
export const SQ_FT_PER_HECTARE = 107639;

/**
 * Converts an area value from a given unit to Square Feet.
 * @param value The numerical area value
 * @param unit The unit of the value ('acres', 'hectares', 'sq_ft')
 * @returns The comparable value in Square Feet
 */
export const convertAreaToSqFt = (value: number, unit: string): number => {
  const normalizedUnit = unit.toLowerCase().trim();

  // Normalize sq_ft variations
  if (
    normalizedUnit === 'sq_ft' ||
    normalizedUnit === 'sq ft' ||
    normalizedUnit === 'square feet'
  ) {
    return value;
  }

  if (normalizedUnit === 'acres' || normalizedUnit === 'acre') {
    return value * SQ_FT_PER_ACRE;
  }

  if (normalizedUnit === 'hectares' || normalizedUnit === 'hectare') {
    return value * SQ_FT_PER_HECTARE;
  }

  // Default return value if unit is unknown (or assuming it's already base unit if fallback needed)
  // For validation safety, we might want to return 0 or throw, but returning value allows passing through if unit is weird
  console.warn(
    `Unknown unit for conversion: ${unit}, assuming value is valid as-is or 0 for safety.`
  );
  return value;
};
