import { Box, Button, Card } from "@mui/material";
import { memo, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useCurrentPath } from "../../hooks";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  MarketingIcon,
  OrderIcon,
  ProductIcon,
  UserIcon,
  CategoryIcon,
} from "../../icons";

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 15vw;
  border-radius: ;
`;
const ButtonsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 3vh;
  justify-contents: center;
  align-items: center;
  gap: 3vh;
`;
const StyledButton = styled(Button)<{ $selected?: boolean }>`
  height: 5vh;
  color: ${({ theme }) => theme.colors.greys[5]};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.greys[0] : theme.colors.white};
  &:hover {
    background-color: ${({ theme }) => theme.colors.greys[1]};
  }
  font-size: ${({ theme }) => theme.fontSize.medium};
  width: 100%;
`;
const IconWrapper = styled(Box)`
  margin-left: 0;
  margin-right: auto;
  display: flex;
  justify-contents: center;
`;
const TextWrapper = styled(Box)`
  margin-right: auto;
`;

const StyledHomeIcon = styled(HomeIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.white};
  }
  transform: scale(0.6);
`;
const StyledProductIcon = styled(ProductIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.6);
`;
const StyledUserIcon = styled(UserIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.6);
`;
const StyledOrderIcon = styled(OrderIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.6);
`;
const StyledMarketingIcon = styled(MarketingIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.6);
`;
const StyledCategoryIcon = styled(CategoryIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.6);
`;
export const NavBar = memo(() => {
  const navigate = useNavigate();
  const { matchpath } = useCurrentPath();
  const { t } = useTranslation();
  const Buttons = useMemo(
    () => [
      {
        text: ROUTES.Home.key,
        navagation_link: ROUTES.Home.path,
        icon: <StyledHomeIcon />,
      },
      {
        text: ROUTES.Orders.key,
        navagation_link: ROUTES.Orders.path,
        icon: <StyledOrderIcon />,
      },
      {
        text: ROUTES.Products.key,
        navagation_link: ROUTES.Products.path,
        icon: <StyledProductIcon />,
      },
      {
        text: ROUTES.Categories.key,
        navagation_link: ROUTES.Categories.path,
        icon: <StyledCategoryIcon />,
      },
      {
        text: ROUTES.Users.key,
        navagation_link: ROUTES.Users.path,
        icon: <StyledUserIcon />,
      },
      {
        text: ROUTES.Marketing.key,
        navagation_link: ROUTES.Marketing.path,
        icon: <StyledMarketingIcon />,
      },
    ],
    []
  );

  return (
    <StyledCard>
      <ButtonsWrapper>
        {Buttons.map(({ text, navagation_link, icon }) => (
          <StyledButton
            onClick={() => {
              navigate(navagation_link);
            }}
            key={text}
            $selected={text == matchpath}
          >
            <IconWrapper>{icon}</IconWrapper>
            <TextWrapper>{t(`navBar.${text}`)}</TextWrapper>
          </StyledButton>
        ))}
      </ButtonsWrapper>
    </StyledCard>
  );
});

NavBar.displayName = "NavBar";
