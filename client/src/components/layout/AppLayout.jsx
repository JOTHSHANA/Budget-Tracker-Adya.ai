import { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen w-screen box-sizing-border fixed">
            <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex h-full">
                <SideBar open={sidebarOpen} />
                <div className=" w-full bg-gray-100 p-6 overflow-auto pb-20">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;