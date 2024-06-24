import { memo } from "react";
import { LineChart, PieChart } from "../../components";
import { Card, Box } from "@mui/material";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  useMonthlySalesData,
  useTodaySalesData,
  useUsersAgeData,
  useUsersGenderData,
} from "./hooks";
import {
  useCategoryCRUD,
  useOrderCRUD,
  useProductCRUD,
  useUserCRUD,
} from "../../hooks";

const CardWithChart = styled(Card)`
  margin: 10px;
  padding: 10px;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CardWithText = styled(Card)`
  margin: 10px;
  padding: 10px;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 30vh;
`;

const Wrapper = styled(Box)`
  display: flex;
  flex-direciton: row;
  flex-wrap: wrap;
  overflow: auto;
  height: 100%;
`;

const CardTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.medium};
  position: absolute;
  top: 10px;
  left: 10px;
`;
const StyledText = styled(Box)`
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.extreme_large};
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 30vh;
`;
export const HomePage = memo(() => {
  const { t } = useTranslation();
  const { usersAgeData } = useUsersAgeData();
  const { usersGenderData } = useUsersGenderData();
  const { monthlySalesData } = useMonthlySalesData();
  const { userList } = useUserCRUD();
  const { productList } = useProductCRUD();
  const { todaySales, todayOrders } = useTodaySalesData();
  const { orderList } = useOrderCRUD();
  const { categoriesList } = useCategoryCRUD();
  return (
    <Wrapper>
      <CardWithText>
        <CardTitle>{t("home.total_users")}</CardTitle>
        <StyledText>{userList.length}</StyledText>
      </CardWithText>
      <CardWithText>
        <CardTitle>{t("home.total_orders")}</CardTitle>{" "}
        <StyledText>{orderList.length}</StyledText>
      </CardWithText>
      <CardWithText>
        <CardTitle>{t("home.total_products")}</CardTitle>{" "}
        <StyledText>{productList.length}</StyledText>
      </CardWithText>
      <CardWithText>
        <CardTitle>{t("home.total_categories")}</CardTitle>{" "}
        <StyledText>{categoriesList.length}</StyledText>
      </CardWithText>
      <CardWithText>
        <CardTitle>{t("home.today_sales")}</CardTitle>{" "}
        <StyledText>{todaySales}</StyledText>
      </CardWithText>
      <CardWithText>
        <CardTitle>{t("home.today_orders")}</CardTitle>{" "}
        <StyledText>{todayOrders}</StyledText>
      </CardWithText>
      <CardWithChart>
        <CardTitle>{t("user.gender")}</CardTitle>
        <ChartWrapper>
          <PieChart data={usersGenderData} />
        </ChartWrapper>
      </CardWithChart>

      <CardWithChart>
        <CardTitle>{t("user.age")}</CardTitle>
        <ChartWrapper>
          <PieChart data={usersAgeData} />
        </ChartWrapper>
      </CardWithChart>

      <CardWithChart>
        <CardTitle>{t("home.monthly_sales")}</CardTitle>
        <ChartWrapper>
          <LineChart data={monthlySalesData} />
        </ChartWrapper>
      </CardWithChart>
    </Wrapper>
  );
});

HomePage.displayName = "HomePage";
