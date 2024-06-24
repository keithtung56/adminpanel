import { memo } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { AddIcon } from "../../icons";
import { useTranslation } from "react-i18next";

const StyledButton = styled(Button)`
  padding: 10px 25px;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  &:hover {
    background: ${({ theme }) => theme.colors.blue};
  }
  font-size: ${({ theme }) => theme.fontSize.medium};
`;

const StyledAddIcon = styled(AddIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.white};
  }
  transform: scale(1.3);
`;
type Props = {
  className?: string;
  onClick?: () => void;
};

export const AddButton = memo(({ className, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledButton
      style={{ borderRadius: 10 }}
      className={className}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      startIcon={<StyledAddIcon />}
    >
      {t("button.add")}
    </StyledButton>
  );
});

AddButton.displayName = "AddButton";
