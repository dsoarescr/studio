import React from 'react';

type GenericChartProps = React.HTMLAttributes<HTMLDivElement> & {
  data?: unknown;
};

export function BarChart(props: GenericChartProps) {
  return <div {...props} role="img" aria-label="BarChart" />;
}

export function LineChart(props: GenericChartProps) {
  return <div {...props} role="img" aria-label="LineChart" />;
}

export function PieChart(props: GenericChartProps) {
  return <div {...props} role="img" aria-label="PieChart" />;
}

export function AreaChart(props: GenericChartProps) {
  return <div {...props} role="img" aria-label="AreaChart" />;
}

export function ScatterChart(props: GenericChartProps) {
  return <div {...props} role="img" aria-label="ScatterChart" />;
}

export function DoughnutChart(props: GenericChartProps) {
  return <div {...props} role="img" aria-label="DoughnutChart" />;
}
