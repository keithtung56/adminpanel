import { memo } from "react";
import { User } from "../../../hooks";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";

type Props = {
  userList: User[];
  className?: string;
} & TextFieldProps;

export const SelectUserField = memo(
  ({ userList, className, value, ...props }: Props) => {
    return (
      <TextField
        {...props}
        select
        value={userList.length > 0 ? value : ""}
        className={className}
      >
        {userList.map((user) => (
          <MenuItem value={user.uid} key={user.uid}>
            {user.username}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

SelectUserField.displayName = "SelectUserField";
