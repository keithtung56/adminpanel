import { TableFooter, TablePagination } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledFooter = styled(TableFooter)`
  margin-left: auto;
  margin-right: 0;
`;
export const usePagination = <T,>(sortedData: T[]) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const rowsPerPageOptions = useMemo(
    () => [5, 10, 25, { label: "All", value: -1 }],
    []
  );
  const handleChangePage = useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [setRowsPerPage, setPage]
  );

  const displayData = useMemo(
    () =>
      rowsPerPage > 0
        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedData,
    [rowsPerPage, sortedData, page]
  );

  const paginationComponent = useMemo(
    () => (
      <StyledFooter>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          rowsPerPage={rowsPerPage}
          count={sortedData.length}
          page={page}
          labelRowsPerPage={t("table.rows_per_page")}
          labelDisplayedRows={(page) =>
            t("table.from_to_count", {
              from: page.from,
              to: page.to,
              count: page.count,
            })
          }
          showFirstButton
          showLastButton
          slotProps={{
            select: {},
            actions: {},
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledFooter>
    ),
    [
      rowsPerPageOptions,
      rowsPerPage,
      sortedData,
      page,
      handleChangePage,
      handleChangeRowsPerPage,
      t,
    ]
  );
  return { paginationComponent, displayData };
};
