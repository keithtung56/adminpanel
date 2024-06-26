import { Box } from "@mui/material";
import { PropsWithChildren, memo } from "react";
import styled from "styled-components";
import { AppBar, NavBar, Title } from "../../components";
import { useCurrentPath } from "../../hooks";
import { useTranslation } from "react-i18next";
import { useNavBar } from "../../hooks/useNavBar";

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
      <AppBar listIconOnClick={listIconOnClick} />
      <BodyWrapper>
        <NavBar open={showNavBar} />
        <RightWrapper>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Title>{t(`navBar.${matchpath}`)}</Title>
          </Box>
          {children}
        </RightWrapper>
      </BodyWrapper>
    </>
  );
});
BasePage.displayName = "BasePage";
