import { useMemo } from "react";
import { useOrderCRUD } from "../../../hooks";

export const useTodaySalesData = () => {
  const { orderList } = useOrderCRUD();

  const { sales: todaySales, count: todayOrders } = useMemo(() => {
    let sales = 0;
    let count = 0;
    const current_date = new Date();
    orderList.forEach(({ created_time, total, status }) => {
      if (created_time.isSame(current_date, "day")) {
        if (status === "paid") {
          sales += total;
        }
        count += 1;
      }
    });
    return { sales, count };
  }, [orderList]);
  return { todaySales, todayOrders };
};
