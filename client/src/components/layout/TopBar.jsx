import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function TopBar({ toggleSidebar }) {
    const { user } = useContext(AuthContext);

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '';
    };

    return (
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="text-white text-xl font-bold">
                    ☰
                </button>
                <h1 className="text-xl font-bold">Budget Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-blue-900 font-bold">
                    {getInitial(user?.name)}
                </div>
                <span className="hidden md:inline">{user?.name}</span>
            </div>
        </div>
    );
}

export default TopBar;
