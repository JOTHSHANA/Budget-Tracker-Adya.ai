import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GpsFixedSharpIcon from '@mui/icons-material/GpsFixedSharp';

const sidebarItems = [
    { name: "Dashboard", path: "/", icon: DashboardIcon },
    { name: "Fix Budget", path: "/budget-fix", icon: GpsFixedSharpIcon },
    { name: "Transactions", path: "/transactions", icon: ReceiptLongIcon },
    { name: "Reports", path: "/reports", icon: HistoryIcon },
    { name: "Money Assistant", path: "/assistant", icon: GpsFixedSharpIcon },


];

function SideBar({ open }) {
    const location = useLocation();

    return (
        <div
            className={`
    bg-white h-full shadow-custom transition-all duration-300
    ${open ? "w-72" : "w-0 md:w-[70px]"} 
    overflow-hidden z-10
  `}
        >            <div className="flex items-center justify-center h-16 border-b">
                <div className="text-xl font-bold text-center">💰</div>
                {open && (
                    <div className="p-3 text-xl font-bold text-center hidden sm:block">
                        Budget_Tracker
                    </div>
                )}
            </div>

            <ul className="mt-4 m-2">
                {sidebarItems.map(({ name, path, icon: Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <li key={path} className={`${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"} hover:bg-blue-50 rounded-5px`}>
                            <Link to={path} className="flex items-center p-3 space-x-3">
                                <Icon className="text-xl" />
                                {open && <span className="text-sm font-medium">{name}</span>}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default SideBar;

