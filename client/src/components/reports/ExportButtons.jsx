import React, { useState, useEffect } from "react";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ExportButtons = ({ transactions, userToken }) => {
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    useEffect(() => {
        const fetchFiltered = async () => {
            if (selectedMonth === "All") {
                setFilteredTransactions(transactions);
                return;
            }

            try {
                const res = await axios.get(
                    `http://localhost:5000/api/transactions/by-month?month=${selectedMonth}`,
                    {
                        headers: { Authorization: `Bearer ${userToken}` },
                    }
                );
                setFilteredTransactions(res.data);
            } catch (err) {
                console.error("Fetch failed:", err);
            }
        };

        fetchFiltered();
    }, [selectedMonth, transactions, userToken]);

    const exportToCSV = () => {
        const ws = utils.json_to_sheet(filteredTransactions);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Transactions");
        writeFile(wb, "transactions.csv");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Transaction Report", 14, 16);

        const tableColumn = ["Date", "Type", "Category", "Amount", "Note"];
        const tableRows = filteredTransactions.map((tx) => [
            new Date(tx.createdAt).toLocaleDateString(),
            tx.type,
            tx.category,
            `Rs. ${tx.amount}`,
            tx.note || "-",
        ]);

        doc.autoTable({
            startY: 25,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("transactions.pdf");
    };

    return (
        <div className="mt-6 flex flex-col gap-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    sx={{ width: "300px" }}
                    views={["year", "month"]}
                    label="Select Month"
                    value={selectedMonth === "All" ? null : dayjs(selectedMonth)}
                    onChange={(newValue) =>
                        setSelectedMonth(newValue ? newValue.format("YYYY-MM") : "All")
                    }
                    slotProps={{
                        textField: {
                            size: "small",
                            className: "bg-white rounded-5px",
                        },
                    }}
                />
            </LocalizationProvider>

            <div className="flex gap-4">
                <button
                    onClick={exportToPDF}
                    className="bg-green-600 text-white px-4 py-2 rounded-5px font-bold"
                >
                    Export as PDF
                </button>
                <button
                    onClick={exportToCSV}
                    className="bg-blue-600 text-white px-4 py-2 rounded-5px font-bold"
                >
                    Download CSV
                </button>
            </div>
        </div>
    );
};

export default ExportButtons;
