import { memo } from "react";
import { Category } from "../../../hooks";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";

type Props = {
  categoriesList: Category[];
  className?: string;
} & TextFieldProps;

export const SelectCategoryField = memo(
  ({ categoriesList, className, value, ...props }: Props) => {
    return (
      <TextField
        {...props}
        select
        value={categoriesList.length > 0 ? value : ""}
        className={className}
      >
        {categoriesList.map((category) => (
          <MenuItem value={category.category_id} key={category.category_id}>
            {category.category_name}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

SelectCategoryField.displayName = "SelectCategoryField";
