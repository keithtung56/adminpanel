import { BarChart as MuiBarChart } from "@mui/x-charts";
import { memo } from "react";

type Props = {
  data: { [key: string]: number };
};
export const BarChart = memo(({ data }: Props) => {
  return (
    <MuiBarChart
      series={[
        {
          data: Object.values(data),
        },
      ]}
      height={290}
      xAxis={[{ data: Object.keys(data), scaleType: "band" }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
});

BarChart.displayName = "BarChart";
