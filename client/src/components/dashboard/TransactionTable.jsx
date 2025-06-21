import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";

const TransactionTable = ({ transactions }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 1 , height:"100%"}} className="shadow-custom">
      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2 }}>
        Recent Transactions
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Note</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((txn) => (
                <TableRow key={txn._id} hover>
                  <TableCell sx={{ textTransform: "capitalize" }}>{txn.type}</TableCell>
                  <TableCell>{txn.category}</TableCell>
                  <TableCell sx={{ color: "#2563eb" }}>₹{txn.amount}</TableCell>
                  <TableCell>{txn.note}</TableCell>
                  <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </Paper>
  );
};

export default TransactionTable;
