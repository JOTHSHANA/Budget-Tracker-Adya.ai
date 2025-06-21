// context/BudgetAlertContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import apiHost from "../components/utils/api";

export const BudgetAlertContext = createContext();

export const BudgetAlertProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [violations, setViolations] = useState([]);

    const fetchViolations = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`{apiHost}/api/alerts/budget-check`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setViolations(res.data.violations || []);
        } catch (err) {
            console.error("Failed to fetch budget violations", err);
        }
    };

    useEffect(() => {
        fetchViolations(); // initial fetch
    }, [user]);

    return (
        <BudgetAlertContext.Provider value={{ violations, fetchViolations }}>
            {children}
        </BudgetAlertContext.Provider>
    );
};
