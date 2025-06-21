import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TablePagination
} from "@mui/material";

const TransactionsTable = ({ transactions }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginated = transactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="bg-white p-4 sm:p-6 rounded-5px shadow-custom w-full overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Recent Transactions</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Note</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map((txn) => (
                            <TableRow key={txn._id}>
                                <TableCell sx={{ textTransform: "capitalize" }}>{txn.type}</TableCell>
                                <TableCell>{txn.category}</TableCell>
                                <TableCell sx={{ color: "#2563EB" }}>₹{txn.amount}</TableCell>
                                <TableCell>{txn.note}</TableCell>
                                <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        {paginated.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ color: "#888" }}>
                                    No transactions yet.
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
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </div>
    );
};

export default TransactionsTable;
