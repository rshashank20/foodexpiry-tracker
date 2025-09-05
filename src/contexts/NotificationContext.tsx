import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { GetInventoryWithMetadata } from '@/firebaseUtils';

export interface Notification {
  id: string;
  type: 'expiring' | 'expired' | 'recipe_suggestion';
  title: string;
  message: string;
  itemId?: string;
  itemName?: string;
  daysLeft?: number;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { notificationSettings } = useSettings();

  // Load notifications from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedNotifications = localStorage.getItem(`notifications_${currentUser.uid}`);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          setNotifications(parsed);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    }
    setLoading(false);
  }, [currentUser]);

  // Save notifications to localStorage
  useEffect(() => {
    if (currentUser && notifications.length > 0) {
      localStorage.setItem(`notifications_${currentUser.uid}`, JSON.stringify(notifications));
    }
  }, [notifications, currentUser]);

  // Generate notifications based on inventory
  useEffect(() => {
    const generateNotifications = async () => {
      if (!currentUser) return;

      try {
        const items = await GetInventoryWithMetadata(currentUser.uid);
        const newNotifications: Notification[] = [];

        items.forEach(item => {
          const itemId = item.id;
          const itemName = item.item_name;
          const daysLeft = item.daysLeft;

          // Remove old notifications for this item
          setNotifications(prev => prev.filter(n => n.itemId !== itemId));

          // Check if notifications are enabled for this type
          const shouldNotifyExpired = notificationSettings.expiredAlerts;
          const shouldNotifyExpiring = notificationSettings.expiringAlerts;
          const shouldNotifyRecipes = notificationSettings.recipeSuggestions;
          const reminderDays = notificationSettings.reminderDays;

          // Generate new notifications based on expiry status and user settings
          if (daysLeft < 0 && shouldNotifyExpired) {
            // Item has expired
            newNotifications.push({
              id: `expired_${itemId}_${Date.now()}`,
              type: 'expired',
              title: 'Item Expired',
              message: `${itemName} has expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`,
              itemId,
              itemName,
              daysLeft,
              timestamp: new Date(),
              read: false,
              actionUrl: '#inventory'
            });
          } else if (daysLeft === 0 && shouldNotifyExpiring) {
            // Item expires today
            newNotifications.push({
              id: `expiring_today_${itemId}_${Date.now()}`,
              type: 'expiring',
              title: 'Expires Today',
              message: `${itemName} expires today! Use it soon or consider making a recipe.`,
              itemId,
              itemName,
              daysLeft,
              timestamp: new Date(),
              read: false,
              actionUrl: shouldNotifyRecipes ? '#recipes' : '#inventory'
            });
          } else if (daysLeft === 1 && shouldNotifyExpiring) {
            // Item expires tomorrow
            newNotifications.push({
              id: `expiring_tomorrow_${itemId}_${Date.now()}`,
              type: 'expiring',
              title: 'Expires Tomorrow',
              message: `${itemName} expires tomorrow. Check out recipe suggestions!`,
              itemId,
              itemName,
              daysLeft,
              timestamp: new Date(),
              read: false,
              actionUrl: shouldNotifyRecipes ? '#recipes' : '#inventory'
            });
          } else if (daysLeft <= reminderDays && shouldNotifyExpiring) {
            // Item expires within user-defined reminder days
            newNotifications.push({
              id: `expiring_soon_${itemId}_${Date.now()}`,
              type: 'expiring',
              title: 'Expires Soon',
              message: `${itemName} expires in ${daysLeft} days. Time to plan a meal!`,
              itemId,
              itemName,
              daysLeft,
              timestamp: new Date(),
              read: false,
              actionUrl: shouldNotifyRecipes ? '#recipes' : '#inventory'
            });
          }
        });

        // Add new notifications, avoiding duplicates
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
          return [...prev, ...uniqueNewNotifications];
        });

      } catch (error) {
        console.error('Error generating notifications:', error);
      }
    };

    if (currentUser) {
      generateNotifications();
    }
  }, [currentUser, notificationSettings]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications,
    loading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
