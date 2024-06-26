import { useMemo } from "react";
import { useOrderCRUD } from "../../../hooks";

export const useMonthlySalesData = () => {
  const { orderList } = useOrderCRUD();

  const monthlySalesData = useMemo(() => {
    const init: { [key: string]: number } = {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
    };

    orderList.forEach(({ created_time, total, status }) => {
      if (status == "unpaid") return;
      const month = created_time.format("M");
      init[month] += total;
    });
    return init;
  }, [orderList]);

  return { monthlySalesData };
};
