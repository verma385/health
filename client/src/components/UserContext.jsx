
import { createContext } from 'react';
// export const UserContext = createContext(null);
// import { useState } from 'react';

// const [user, setUser] = useState({username:"hi"});

export const UserContext = createContext({
    user: {},
    setUser: () => {},
});
