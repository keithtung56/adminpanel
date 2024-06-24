import { memo } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { DeleteIcon } from "../../icons";
import { useTranslation } from "react-i18next";

const StyledButton = styled(Button)`
  padding: 10px 25px;
  background-color: ${({ theme }) => theme.colors.red};
  color: ${({ theme }) => theme.colors.white};
  &:hover {
    background: ${({ theme }) => theme.colors.red};
  }
  font-size: ${({ theme }) => theme.fontSize.medium};
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  * {
    stroke: ${({ theme }) => theme.colors.white};
    fill: ${({ theme }) => theme.colors.white};
  }
  transform: scale(1.3);
`;

type Props = {
  className?: string;
  onClick?: () => void;
};

export const DeleteButton = memo(({ className, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledButton
      className={className}
      style={{ borderRadius: 10 }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      startIcon={<StyledDeleteIcon />}
    >
      {t("button.delete")}
    </StyledButton>
  );
});

DeleteButton.displayName = "DeleteButton";
