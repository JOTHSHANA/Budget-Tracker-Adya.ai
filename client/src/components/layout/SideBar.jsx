import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";

const sidebarItems = [
    { name: "Dashboard", path: "/", icon: DashboardIcon },
    { name: "Reports", path: "/reports", icon: HistoryIcon },
];

function SideBar({ open }) {
    const location = useLocation();

    return (
        <div className={`bg-white h-full shadow-lg transition-all duration-300 ${open ? "w-64" : "w-16"} overflow-hidden`}>
            <div className="p-4 text-xl font-bold text-center border-b">💰</div>
            <ul className="mt-4 m-2">
                {sidebarItems.map(({ name, path, icon: Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <li key={path} className={`${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"} hover:bg-blue-50`}>
                            <Link to={path} className="flex items-center p-4 space-x-3">
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

