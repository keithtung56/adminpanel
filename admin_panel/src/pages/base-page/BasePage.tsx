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
  padding: 0 15px;
  width: 100%;
  margin: 0 15px;
`;

const StyledBox = styled(Box)`
  margin: 25px 0;
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
          <StyledBox component="main">
            <Title>{t(`navBar.${matchpath}`)}</Title>
          </StyledBox>
          {children}
        </RightWrapper>
      </BodyWrapper>
    </>
  );
});
BasePage.displayName = "BasePage";
