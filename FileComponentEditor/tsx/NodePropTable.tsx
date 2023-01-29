import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
//import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function NodePropTable({ rows }: { rows: [string, JSX.Element, boolean?][] }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        {/*<TableHead>
          <TableRow>
            <TableCell>key</TableCell>
            <TableCell>value</TableCell>
          </TableRow>
        </TableHead>*/}
        <TableBody>
          {rows.map(([key, value, valueElementIsFilled]) => (
            <TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ px: 0.5 }}>
                {key}
              </TableCell>
              <TableCell sx={{ p: valueElementIsFilled ? 0 : undefined }}>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
