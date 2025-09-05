import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface NotificationSettings {
  expiringAlerts: boolean;
  expiredAlerts: boolean;
  recipeSuggestions: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderDays: number;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  compactView: boolean;
  showImages: boolean;
  itemsPerPage: number;
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  crashReporting: boolean;
  locationTracking: boolean;
  profileVisibility: 'private' | 'friends' | 'public';
}

export interface AccountSettings {
  displayName: string;
  email: string;
  phone: string;
  timezone: string;
}

interface SettingsContextType {
  notificationSettings: NotificationSettings;
  displaySettings: DisplaySettings;
  privacySettings: PrivacySettings;
  accountSettings: AccountSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  updateAccountSettings: (settings: Partial<AccountSettings>) => void;
  resetToDefaults: () => void;
  loading: boolean;
}

const defaultNotificationSettings: NotificationSettings = {
  expiringAlerts: true,
  expiredAlerts: true,
  recipeSuggestions: true,
  emailNotifications: false,
  pushNotifications: true,
  reminderDays: 3,
  quietHours: false,
  quietStart: "22:00",
  quietEnd: "08:00"
};

const defaultDisplaySettings: DisplaySettings = {
  theme: 'system',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  compactView: false,
  showImages: true,
  itemsPerPage: 20
};

const defaultPrivacySettings: PrivacySettings = {
  dataSharing: false,
  analytics: true,
  crashReporting: true,
  locationTracking: false,
  profileVisibility: 'private'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(defaultDisplaySettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    displayName: '',
    email: '',
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        const savedNotificationSettings = localStorage.getItem(`notificationSettings_${currentUser.uid}`);
        if (savedNotificationSettings) {
          setNotificationSettings(JSON.parse(savedNotificationSettings));
        }

        const savedDisplaySettings = localStorage.getItem(`displaySettings_${currentUser.uid}`);
        if (savedDisplaySettings) {
          setDisplaySettings(JSON.parse(savedDisplaySettings));
        }

        const savedPrivacySettings = localStorage.getItem(`privacySettings_${currentUser.uid}`);
        if (savedPrivacySettings) {
          setPrivacySettings(JSON.parse(savedPrivacySettings));
        }

        const savedAccountSettings = localStorage.getItem(`accountSettings_${currentUser.uid}`);
        if (savedAccountSettings) {
          setAccountSettings(JSON.parse(savedAccountSettings));
        } else {
          // Initialize with user data
          setAccountSettings(prev => ({
            ...prev,
            displayName: currentUser.displayName || '',
            email: currentUser.email || ''
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setLoading(false);
  }, [currentUser]);

  // Save settings to localStorage
  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`notificationSettings_${currentUser.uid}`, JSON.stringify(notificationSettings));
    }
  }, [notificationSettings, currentUser, loading]);

  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`displaySettings_${currentUser.uid}`, JSON.stringify(displaySettings));
    }
  }, [displaySettings, currentUser, loading]);

  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`privacySettings_${currentUser.uid}`, JSON.stringify(privacySettings));
    }
  }, [privacySettings, currentUser, loading]);

  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`accountSettings_${currentUser.uid}`, JSON.stringify(accountSettings));
    }
  }, [accountSettings, currentUser, loading]);

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const updateDisplaySettings = (settings: Partial<DisplaySettings>) => {
    setDisplaySettings(prev => ({ ...prev, ...settings }));
  };

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings(prev => ({ ...prev, ...settings }));
  };

  const updateAccountSettings = (settings: Partial<AccountSettings>) => {
    setAccountSettings(prev => ({ ...prev, ...settings }));
  };

  const resetToDefaults = () => {
    setNotificationSettings(defaultNotificationSettings);
    setDisplaySettings(defaultDisplaySettings);
    setPrivacySettings(defaultPrivacySettings);
    setAccountSettings({
      displayName: currentUser?.displayName || '',
      email: currentUser?.email || '',
      phone: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  const value = {
    notificationSettings,
    displaySettings,
    privacySettings,
    accountSettings,
    updateNotificationSettings,
    updateDisplaySettings,
    updatePrivacySettings,
    updateAccountSettings,
    resetToDefaults,
    loading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
