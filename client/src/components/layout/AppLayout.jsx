import { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen w-screen flex flex-col box-sizing-border">
            <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1">
                <SideBar open={sidebarOpen} />
                <div className="flex-1 bg-gray-100 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;