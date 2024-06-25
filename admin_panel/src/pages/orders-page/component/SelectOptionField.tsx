import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import { memo } from "react";
import { Options } from "../../../hooks";

type Props = {
  choices: Options[0]["choices"];
  className?: string;
} & TextFieldProps;

export const SelectOptionField = memo(
  ({ className, choices, value, ...props }: Props) => {
    return (
      <TextField
        {...props}
        select
        value={choices.length > 0 ? value : ""}
        className={className}
      >
        {choices.map((choice) => (
          <MenuItem value={choice} key={choice}>
            {choice}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);
