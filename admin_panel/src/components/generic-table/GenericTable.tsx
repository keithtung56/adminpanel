import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
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

const StyledTableContainer = styled(TableContainer)``;
const StyledTable = styled(Table)``;
const StyledTableHead = styled(TableHead)``;
const StyledTableBody = styled(TableBody)``;

const StyledRow = styled(TableRow)``;
const StyledCell = styled(TableCell)`
  align-self: flex-start;
  max-width: 30vw;
`;

export const GenericTable = memo(
  <T extends { [index: string]: any }>({
    data,
    generator,
    unique_col,
    className,
  }: GenericTableProp<T>) => {
    return (
      <StyledTableContainer>
        <StyledTable className={className} stickyHeader>
          <StyledTableHead>
            <TableRow>
              {generator.map((col) => (
                <StyledCell key={col.key}>
                  {typeof col.header === "function"
                    ? col.header()
                    : String(col.header)}
                </StyledCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <StyledTableBody>
            {data.map((datum) => {
              return (
                <StyledRow key={datum[unique_col]}>
                  {generator.map((col) => (
                    <StyledCell key={col.key}>{col.render(datum)}</StyledCell>
                  ))}
                </StyledRow>
              );
            })}
          </StyledTableBody>
          <TableFooter></TableFooter>
        </StyledTable>
      </StyledTableContainer>
    );
  }
);

GenericTable.displayName = "GenericTable";
