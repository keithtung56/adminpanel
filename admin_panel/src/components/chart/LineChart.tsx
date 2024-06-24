import { memo } from "react";
import { LineChart as MuiLineChart } from "@mui/x-charts";

type Props = {
  data: { [key: string]: number };
};

export const LineChart = memo(({ data }: Props) => {
  return <MuiLineChart series={[{ data: Object.values(data), area: true }]} />;
});

LineChart.displayName = "LineChart";
