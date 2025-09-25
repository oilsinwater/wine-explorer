export interface SummaryStats {
  min: number;
  max: number;
  q1: number;
  median: number;
  q3: number;
  modeRange: {
    start: number;
    end: number;
  };
}

const clampToPrecision = (value: number, precision = 2) =>
  Number.parseFloat(value.toFixed(precision));

const interpolateQuantile = (sortedValues: number[], position: number) => {
  const baseIndex = Math.floor(position);
  const fraction = position - baseIndex;
  const nextIndex = Math.min(baseIndex + 1, sortedValues.length - 1);

  if (baseIndex === nextIndex) {
    return sortedValues[baseIndex];
  }

  return (
    sortedValues[baseIndex] +
    fraction * (sortedValues[nextIndex] - sortedValues[baseIndex])
  );
};

export const calculateSummaryStats = (
  values: number[]
): SummaryStats | null => {
  if (!values.length) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  const q1 = interpolateQuantile(sorted, (sorted.length - 1) * 0.25);
  const median = interpolateQuantile(sorted, (sorted.length - 1) * 0.5);
  const q3 = interpolateQuantile(sorted, (sorted.length - 1) * 0.75);

  const binCount =
    range === 0 ? 1 : Math.max(1, Math.round(Math.sqrt(sorted.length)));
  const binSize = range === 0 ? 1 : range / binCount;

  let bestStart = min;
  let bestCount = 0;
  let cursor = 0;

  for (let index = 0; index < binCount; index += 1) {
    const start = min + index * binSize;
    const end = index === binCount - 1 ? max : start + binSize;
    let count = 0;

    while (
      cursor + count < sorted.length &&
      (index === binCount - 1
        ? sorted[cursor + count] <= end
        : sorted[cursor + count] < end)
    ) {
      count += 1;
    }

    if (count > bestCount) {
      bestCount = count;
      bestStart = start;
    }

    cursor += count;
  }

  const modeEnd = range === 0 ? max : Math.min(max, bestStart + binSize);

  return {
    min,
    max,
    q1,
    median,
    q3,
    modeRange: {
      start: bestStart,
      end: modeEnd,
    },
  };
};

export const generateHistogramDescription = (
  featureName: string,
  values: number[]
): string => {
  if (!values.length) {
    return `No data available to describe the ${featureName} histogram.`;
  }

  const stats = calculateSummaryStats(values);

  if (!stats) {
    return `No summary statistics available for ${featureName} histogram.`;
  }

  return `This histogram shows ${values.length.toLocaleString()} wines. ${featureName} ranges from ${clampToPrecision(
    stats.min
  )} to ${clampToPrecision(stats.max)}. Quartiles: lower ${clampToPrecision(
    stats.q1
  )}, median ${clampToPrecision(stats.median)}, upper ${clampToPrecision(
    stats.q3
  )}. Most common range is ${clampToPrecision(stats.modeRange.start)} to ${clampToPrecision(
    stats.modeRange.end
  )}.`;
};

export const calculatePearsonCorrelation = (
  xValues: number[],
  yValues: number[]
): number | null => {
  const length = Math.min(xValues.length, yValues.length);

  if (length === 0) {
    return null;
  }

  const trimmedX = xValues.slice(0, length);
  const trimmedY = yValues.slice(0, length);

  const meanX =
    trimmedX.reduce((accumulator, value) => accumulator + value, 0) / length;
  const meanY =
    trimmedY.reduce((accumulator, value) => accumulator + value, 0) / length;

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let index = 0; index < length; index += 1) {
    const dx = trimmedX[index] - meanX;
    const dy = trimmedY[index] - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  }

  const denominator = Math.sqrt(sumSqX * sumSqY);

  if (denominator === 0) {
    return null;
  }

  return numerator / denominator;
};

export const generateScatterDescription = (
  xFeature: string,
  yFeature: string,
  xValues: number[],
  yValues: number[]
): string => {
  if (!xValues.length || !yValues.length) {
    return `No data available to describe the ${yFeature} versus ${xFeature} scatter plot.`;
  }

  const statsX = calculateSummaryStats(xValues);
  const statsY = calculateSummaryStats(yValues);
  const correlation = calculatePearsonCorrelation(xValues, yValues);

  const parts = [
    `${Math.min(xValues.length, yValues.length).toLocaleString()} wines plotted.`,
  ];

  if (statsX) {
    parts.push(
      `${xFeature} ranges from ${clampToPrecision(statsX.min)} to ${clampToPrecision(
        statsX.max
      )}.`
    );
  }

  if (statsY) {
    parts.push(
      `${yFeature} ranges from ${clampToPrecision(statsY.min)} to ${clampToPrecision(
        statsY.max
      )}.`
    );
  }

  if (typeof correlation === 'number') {
    parts.push(
      `Pearson correlation coefficient ${clampToPrecision(correlation, 3)}.`
    );
  }

  return `Scatter plot summary: ${parts.join(' ')}`;
};
