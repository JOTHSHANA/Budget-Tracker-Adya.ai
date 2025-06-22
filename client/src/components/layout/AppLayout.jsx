import { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen w-screen box-border fixed overflow-hidden">
            <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            {/* Backdrop on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-full relative">
                <SideBar open={sidebarOpen} />
                
                {/* Main content */}
                <div className="flex-1 bg-gray-100 overflow-auto pb-20 z-0 ">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;