import { PieChart as MuiPieChart } from "@mui/x-charts";
import { memo } from "react";

type Data = {
  [key: string]: number;
};
type Prop = {
  data: Data;
};
export const PieChart = memo(({ data }: Prop) => {
  const series = Object.keys(data).map((key) => ({
    label: key,
    value: data[key as keyof typeof data],
  }));

  return (
    <MuiPieChart
      series={[
        {
          data: series,
        },
      ]}
      width={400}
      height={200}
    />
  );
});

PieChart.displayName = "PieChart";
