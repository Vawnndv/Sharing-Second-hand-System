// contexts/UnreadCountContext.ts
import React from 'react';

export const UnreadCountContext = React.createContext<{ setUnreadCount: React.Dispatch<React.SetStateAction<number>> | null }>(null);
