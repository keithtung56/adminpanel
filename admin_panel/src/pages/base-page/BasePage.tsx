import { Box } from "@mui/material";
import { PropsWithChildren, memo } from "react";
import styled from "styled-components";
import { AppBar, NavBar, Title } from "../../components";
import { useCurrentPath } from "../../hooks";
import { useTranslation } from "react-i18next";
import { useNavBar } from "../../hooks/useNavBar";

const AppBarWrapper = styled(Box)`
  height: 10vh;
`;
const BodyWrapper = styled.div`
  display: flex;
  height: 90vh;
`;

const RightWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 30px;
  width: 100%;
`;

export const BasePage = memo<PropsWithChildren>(({ children }) => {
  const { matchpath } = useCurrentPath();
  const { t } = useTranslation();
  const { showNavBar, listIconOnClick } = useNavBar();
  return (
    <>
      <AppBarWrapper>
        <AppBar listIconOnClick={listIconOnClick} />
      </AppBarWrapper>
      <BodyWrapper>
        {showNavBar && <NavBar />}
        <RightWrapper>
          <Box>
            <Title>{t(`navBar.${matchpath}`)}</Title>
          </Box>
          {children}
        </RightWrapper>
      </BodyWrapper>
    </>
  );
});
BasePage.displayName = "BasePage";
