
function TopBar({ toggleSidebar }) {
    return (
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <button onClick={toggleSidebar} className="text-white text-xl font-bold">
                ☰
            </button>
            <h1 className="text-xl font-bold">Adya Budget Tracker</h1>
        </div>
    );
}

export default TopBar;
