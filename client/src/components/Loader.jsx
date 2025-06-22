// components/Loader.jsx
import React from "react";

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-full w-full py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
