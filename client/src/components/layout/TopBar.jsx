import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BudgetAlertContext } from "../../context/BudgetAlertContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

function TopBar({ toggleSidebar }) {
    const { user } = useContext(AuthContext);
    const { violations } = useContext(BudgetAlertContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "";

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="bg-blue-600 text-white p-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="text-white text-xl font-bold">
                        ☰
                    </button>
                    <h1 className="text-xl font-bold">Budget Tracker</h1>
                </div>

                <div className="flex items-center gap-4">
                    <IconButton aria-describedby={id} onClick={handleClick} color="inherit">
                        <Badge badgeContent={violations.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-blue-900 font-bold">
                        {getInitial(user?.name)}
                    </div>
                    <span className="hidden md:inline">{user?.name}</span>
                </div>
            </div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <div className="p-4 w-80">
                    <Typography variant="h6">⚠️ Budget Warnings</Typography>
                    {violations.length === 0 ? (
                        <Typography variant="body2" className="mt-2">All categories within limits.</Typography>
                    ) : (
                        violations.map((v, idx) => (
                            <div key={idx} className="mt-2 text-sm border-b pb-2">
                                <strong>{v.category}</strong><br />
                                Spent: ₹{v.spent.toFixed(2)}<br />
                                Limit: ₹{v.limit.toFixed(2)}<br />
                                Exceeded by: <span className="text-red-600 font-semibold">₹{v.exceededBy.toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
            </Popover>
        </div>
    );
}

export default TopBar;
