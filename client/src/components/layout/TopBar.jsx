import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function TopBar({ toggleSidebar }) {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <button onClick={toggleSidebar} className="text-white text-xl font-bold">
                ☰
            </button>
            <h1 className="text-xl font-bold">Budget Tracker</h1>
            <p>{user?.name}</p> {/* safely access name */}
        </div>
    );
}

export default TopBar;
