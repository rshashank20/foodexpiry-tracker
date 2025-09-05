import { useSettings } from '@/contexts/SettingsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsTest() {
  const { 
    notificationSettings, 
    displaySettings, 
    privacySettings, 
    accountSettings,
    updateNotificationSettings,
    updateDisplaySettings,
    updatePrivacySettings,
    updateAccountSettings
  } = useSettings();
  
  const { addNotification } = useNotifications();

  const testNotificationSettings = () => {
    updateNotificationSettings({ 
      expiringAlerts: !notificationSettings.expiringAlerts,
      reminderDays: notificationSettings.reminderDays === 3 ? 5 : 3
    });
  };

  const testDisplaySettings = () => {
    updateDisplaySettings({ 
      theme: displaySettings.theme === 'light' ? 'dark' : 'light',
      compactView: !displaySettings.compactView
    });
  };

  const testPrivacySettings = () => {
    updatePrivacySettings({ 
      analytics: !privacySettings.analytics,
      dataSharing: !privacySettings.dataSharing
    });
  };

  const testAccountSettings = () => {
    updateAccountSettings({ 
      displayName: accountSettings.displayName + ' (Test)',
      phone: '123-456-7890'
    });
  };

  const testNotification = () => {
    addNotification({
      type: 'expiring',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working!',
      itemName: 'Test Item',
      daysLeft: 2
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Settings Functionality Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={testNotificationSettings}>
            Toggle Notification Settings
          </Button>
          <Button onClick={testDisplaySettings}>
            Toggle Display Settings
          </Button>
          <Button onClick={testPrivacySettings}>
            Toggle Privacy Settings
          </Button>
          <Button onClick={testAccountSettings}>
            Update Account Settings
          </Button>
          <Button onClick={testNotification} className="col-span-2">
            Add Test Notification
          </Button>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium">Current Settings:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify({
                notifications: notificationSettings,
                display: displaySettings,
                privacy: privacySettings,
                account: accountSettings
              }, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
