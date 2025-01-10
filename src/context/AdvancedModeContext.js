import React, { createContext, useState } from 'react';

export const AdvancedModeContext = createContext();

export const AdvancedModeProvider = ({ children }) => {
    const [advancedMode, setAdvancedMode] = useState(false);

    return (
        <AdvancedModeContext.Provider value={{ advancedMode, setAdvancedMode }}>
            {children}
        </AdvancedModeContext.Provider>
    );
};
