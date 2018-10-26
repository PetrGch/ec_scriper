export function getFixedNumber(value, fixedParameter) {
  if (value === null || value === undefined || typeof value === "function") {
    return (0).toFixed(fixedParameter);
  }
  if (typeof value === "string") {
    return parseFloat(value).toFixed(fixedParameter);
  }

  if (typeof value === "number") {
    return value.toFixed(fixedParameter);
  }

  return (0).toFixed(fixedParameter);
}