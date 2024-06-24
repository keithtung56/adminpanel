import { memo } from "react";
import { Product } from "../../../hooks";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";

type Props = {
  productList: Product[];
  className?: string;
} & TextFieldProps;

export const SelectProductField = memo(
  ({ productList, className, value, ...props }: Props) => {
    return (
      <TextField
        {...props}
        select
        value={productList.length > 0 ? value : ""}
        className={className}
      >
        {productList.map((product) => (
          <MenuItem value={product.product_id} key={product.product_id}>
            {product.product_name}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

SelectProductField.displayName = "SelectProductField";
