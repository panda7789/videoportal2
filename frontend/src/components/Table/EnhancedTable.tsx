import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  Button,
} from '@mui/material';
import { Box, alpha } from '@mui/system';
import React from 'react';
import { visuallyHidden } from '@mui/utils';
import AspectRatio from 'components/Utils/AspectRatio';

export interface ToolbarButton {
  label: string;
  icon: any;
  onClick(selectedIDs: readonly string[]): void;
}
interface TableDataBase {
  id: string;
}

export interface Attribute<T> {
  id: keyof T;
  label: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  image?: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<T extends TableDataBase, Key extends keyof T>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T extends TableDataBase>(array: readonly T[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableHeadProps<T> {
  attributes: Attribute<T>[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
}

function EnhancedTableHead<T extends TableDataBase>(props: EnhancedTableHeadProps<T>) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, attributes } =
    props;
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {attributes.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            align={headCell.align ?? 'center'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  selected: readonly string[];
  buttons?: ToolbarButton[];
}
function EnhancedTableToolbar({ selected, buttons }: EnhancedTableToolbarProps) {
  return selected.length > 0 ? (
    <Toolbar
      sx={{
        height: '48px !important',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography sx={{ marginRight: 2 }} color="inherit" variant="subtitle1" component="div">
        {selected.length} selected
      </Typography>
      <>
        {buttons?.map((button) => (
          <Button
            key={button.label}
            startIcon={button.icon}
            onClick={() => button.onClick(selected)}
          >
            {button.label}
          </Button>
        ))}
      </>
    </Toolbar>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
}

export interface EnhancedTableProps<T> {
  attributes: Attribute<T>[];
  buttons?: ToolbarButton[];
  rowClick?(event: React.MouseEvent<unknown>, name: string): void;
  rows: T[];
  orderBy: keyof T;
}

export default function EnhancedTable<T extends TableDataBase>({
  rows,
  orderBy: _orderby,
  attributes,
  buttons,
  rowClick,
}: EnhancedTableProps<T>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(_orderby ?? 'id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event: React.MouseEvent<unknown>, name: string) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar buttons={buttons} selected={selected} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              attributes={attributes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort<T>(rows, getComparator<T, typeof orderBy>(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event: React.MouseEvent<unknown, MouseEvent>) => {
                        if (rowClick) {
                          rowClick(event, row.id);
                        }
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" onClick={(event: React.MouseEvent<unknown, MouseEvent>) =>
                            handleCheckboxClick(event, row.id)
                          }>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {attributes.map((attr) => (
                        <TableCell
                          key={String(attr.id)}
                          align="left"
                          sx={{
                            paddingTop: 1,
                            paddingBottom: 1,
                            ...(attr.image && {
                              width: 130,
                            }),
                          }}
                        >
                          {attr.image ?? false ? (
                            <AspectRatio ratio={16 / 9}>
                              <img width="100%" src={String(row[attr.id])} />
                            </AspectRatio>
                          ) : (
                            String(row[attr.id])
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 90 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
