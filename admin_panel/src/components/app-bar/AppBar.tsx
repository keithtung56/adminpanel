import {
  Box,
  Button,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { memo, useContext } from "react";
import styled, { useTheme } from "styled-components";
import { AuthContext } from "../../context";
import { useTranslation } from "react-i18next";
import { ChineseIcon, EnglishIcon, ListIcon, LogoIcon } from "../../icons";

const StyledAppBar = styled(MuiAppBar)`
  display: flex;
  justify-content: center;
`;
const LeftWrapper = styled(Box)`
  display: flex;
`;
const RightWrapper = styled(Box)`
  margin-left: auto;
  display: flex;
`;
const LogoutButton = styled(Button)`
  color: white;
`;
const LanguageButton = styled(Button)`
  color: white;
`;
const StyledText = styled(Typography)`
  font-size: ${({ theme }) => theme.fontSize.large};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const StyledChineseIcon = styled(ChineseIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.white};
  }
  transform: scale(0.7);
`;
const StyledEnglishIcon = styled(EnglishIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.white};
  }
  transform: scale(0.7);
`;
const StyledLogoIcon = styled(LogoIcon)`
  transform: scale(1);
  height: 100%;
`;
const StyledListIcon = styled(ListIcon)`
  height: 100%;
  transform: scale(1);
  * {
    fill: ${({ theme }) => theme.colors.white};
  }
`;
const LogoWrapper = styled(Box)`
  margin-left: 2vw;
`;
type Props = {
  listIconOnClick: () => void;
};
export const AppBar = memo(({ listIconOnClick }: Props) => {
  // @ts-ignore
  const { logOut, user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  return (
    <StyledAppBar
      position="relative"
      sx={{ bgcolor: theme.colors.greys[8], zIndex: 1400 }}
    >
      <Toolbar>
        <LeftWrapper>
          <Button
            onClick={() => {
              listIconOnClick();
            }}
          >
            <StyledListIcon />
          </Button>

          <LogoWrapper>
            <StyledLogoIcon />
          </LogoWrapper>
        </LeftWrapper>
        <RightWrapper>
          <LanguageButton
            onClick={() => {
              i18n.changeLanguage("cn");
            }}
          >
            <StyledChineseIcon />
          </LanguageButton>
          <LanguageButton
            onClick={() => {
              i18n.changeLanguage("en");
            }}
          >
            <StyledEnglishIcon />
          </LanguageButton>
          <StyledText>{user?.email}</StyledText>
          <LogoutButton
            onClick={() => {
              logOut();
            }}
          >
            <StyledText>{t("button.logout")}</StyledText>
          </LogoutButton>
        </RightWrapper>
      </Toolbar>
    </StyledAppBar>
  );
});

AppBar.displayName = "AppBar";
