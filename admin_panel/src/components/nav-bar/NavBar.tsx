import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
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
  VideoIcon,
} from "../../icons";

const StyledListItemButton = styled(ListItemButton)<{ $selected?: boolean }>`
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.greys[0] : theme.colors.white};
`;
const StyledDrawer = styled(Drawer)`
  position: static;
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
const StyledVideoIcon = styled(VideoIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.black};
  }
  transform: scale(0.6);
`;
type Props = {
  open: boolean;
};
export const NavBar = memo(({ open }: Props) => {
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
      {
        text: ROUTES.Video.key,
        navagation_link: ROUTES.Video.path,
        icon: <StyledVideoIcon />,
      },
    ],
    []
  );

  return (
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? 200 : 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? 200 : 0,
        }, //z-index
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {Buttons.map(({ text, navagation_link, icon }) => (
            <ListItem key={text}>
              <StyledListItemButton
                onClick={() => {
                  navigate(navagation_link);
                }}
                $selected={text === matchpath}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{t(`navBar.${text}`)}</ListItemText>
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
});

NavBar.displayName = "NavBar";
