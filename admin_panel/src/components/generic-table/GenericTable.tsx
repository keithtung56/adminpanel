import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { memo } from "react";
import styled from "styled-components";

type GenericTableGenerator = {
  key: string;
  header: string | (() => JSX.Element | string);
  render: (data: any) => string;
};

type GenericTableProp<T> = {
  data: T[];
  generator: GenericTableGenerator[];
  unique_col: string;
  className?: string;
};

const StyledTableHead = styled(TableHead)``;
const StyledTable = styled(Table)``;
export const GenericTable = memo(
  <T extends { [index: string]: any }>({
    data,
    generator,
    unique_col,
    className,
  }: GenericTableProp<T>) => {
    return (
      <StyledTable className={className}>
        <StyledTableHead>
          <TableRow>
            {generator.map((col) => (
              <TableCell key={col.key}>
                {typeof col.header === "function"
                  ? col.header()
                  : String(col.header)}
              </TableCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map((datum) => {
            return (
              <TableRow key={datum[unique_col]}>
                {generator.map((col) => (
                  <TableCell key={col.key}>{col.render(datum)}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    );
  }
);

GenericTable.displayName = "GenericTable";
