import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export interface ProfileData {
  displayName: string;
  bio: string;
  twitter: string;
  discord: string;
  website: string;
}

const defaultProfile: ProfileData = {
  displayName: "",
  bio: "",
  twitter: "",
  discord: "",
  website: "",
};

export function useProfile() {
  const { address } = useAccount();
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage
  useEffect(() => {
    if (address) {
      setIsLoading(true);
      try {
        const saved = localStorage.getItem(`profile_${address}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfileData(parsed);
        } else {
          setProfileData(defaultProfile);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfileData(defaultProfile);
      } finally {
        setIsLoading(false);
      }
    } else {
      setProfileData(defaultProfile);
      setIsLoading(false);
    }
  }, [address]);

  // Save profile to localStorage
  const saveProfile = (data: ProfileData) => {
    if (address) {
      try {
        localStorage.setItem(`profile_${address}`, JSON.stringify(data));
        setProfileData(data);
        return true;
      } catch (error) {
        console.error("Error saving profile:", error);
        return false;
      }
    }
    return false;
  };

  // Clear profile
  const clearProfile = () => {
    if (address) {
      localStorage.removeItem(`profile_${address}`);
      setProfileData(defaultProfile);
    }
  };

  return {
    profileData,
    isLoading,
    saveProfile,
    clearProfile,
  };
}

