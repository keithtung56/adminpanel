import {
  Dialog as MuiDialog,
  DialogProps,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  ButtonProps,
} from "@mui/material";
import { PropsWithChildren, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ActionButton = styled(Button)`
  font-size: ${({ theme }) => theme.fontSize.small};
`;
type Action = {
  text: string;
  onClick?: () => void;
  variant: ButtonProps["variant"];
};
type Props = Omit<DialogProps, "title"> &
  PropsWithChildren & {
    handleClose: (value: boolean) => void;
    className?: string;
    actions?: Action[];
    title: JSX.Element;
  };

export const Dialog = memo(
  ({
    children,
    className,
    actions = [],
    handleClose,
    title,
    ...props
  }: Props) => {
    const { t } = useTranslation();

    const dialogActions = useMemo(() => {
      if (actions.length > 0) {
        return actions;
      }
      return [
        {
          text: t("button.cancel"),
          onClick: () => {
            handleClose(false);
          },
          variant: "outlined",
        },
        {
          text: t("button.confirm"),
          onClick: () => {
            handleClose(true);
          },
          variant: "contained",
        },
      ] as Action[];
    }, [actions, handleClose, t]);

    return (
      <MuiDialog {...props} className={className} maxWidth={"md"}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>

        <DialogActions>
          {dialogActions.map(({ text, onClick, variant }) => (
            <ActionButton
              variant={variant}
              onClick={() => {
                if (onClick) {
                  onClick();
                }
              }}
              key={text}
            >
              {text}
            </ActionButton>
          ))}
        </DialogActions>
      </MuiDialog>
    );
  }
);

Dialog.displayName = "Dialog";
