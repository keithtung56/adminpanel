import { Card, Box, TextField, Button } from "@mui/material";
import { memo, useContext } from "react";
import styled from "styled-components";
import { Title } from "../../components";
import { AuthContext } from "../../context";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useTranslation } from "react-i18next";
import { ChineseIcon, EnglishIcon } from "../../icons";

const StyledCard = styled(Card)`
  width: 25%;
  padding: 20px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  flex: 1 3 1;
  gap: 20px;
`;
const StyledBox = styled(Box)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTextField = styled(TextField)``;
const Head = styled(Box)`
  display: flex;
`;
const Body = styled(Box)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 50px;
`;
const Tail = styled(Box)``;
const LoginButton = styled(Button)`
  float: right;
  font-size: ${({ theme }) => theme.fontSize.medium};
`;

const LanguageButton = styled(Button)`
  color: white;
  &.MuiButton-root {
    height: 5vh;
  }
`;

const LanguageButtonWrapper = styled(Box)`
  margin-left: auto;
  margin-right: 0;
`;
const StyledChineseIcon = styled(ChineseIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.8);
`;
const StyledEnglishIcon = styled(EnglishIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.8);
`;
export const LoginPage = memo(() => {
  const { t, i18n } = useTranslation();
  //@ts-ignore
  const { UserLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await UserLogin(values.email, values.password);
        navigate(ROUTES.Home.path);
      } catch (e) {
        console.log(e);
      }
    },
  });
  if (user) {
    navigate(ROUTES.Home.path);
    return <></>;
  }
  return (
    <StyledBox>
      <StyledCard>
        <Head>
          <Box>
            <Title>{t("button.login")}</Title>
          </Box>
          <LanguageButtonWrapper>
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
          </LanguageButtonWrapper>
        </Head>

        <Body>
          <StyledTextField
            name="email"
            label={t("form.login.email")}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <StyledTextField
            name="password"
            label={t("form.login.password")}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </Body>
        <Tail>
          <LoginButton
            variant="contained"
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            {t("button.login")}
          </LoginButton>
        </Tail>
      </StyledCard>
    </StyledBox>
  );
});

LoginPage.displayName = "LoginPage";
