import React, { createContext, useState } from "react";

export const ProfilePictureContext = createContext<any>(null);

interface ProfilePictureProviderProps {
  children: React.ReactNode;
}

export const ProfilePictureProvider: React.FC<ProfilePictureProviderProps> = ({ children }) => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    return (
        <ProfilePictureContext.Provider value={{ profilePicture, setProfilePicture }}>
            {children}
        </ProfilePictureContext.Provider>
    );
};
