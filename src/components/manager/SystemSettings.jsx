import { useState } from "react";
import { Save, Shield, Bell, Database, Users, Settings as SettingsIcon } from "lucide-react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "Prevention Support System",
    systemDescription: "Hệ thống hỗ trợ phòng chống ma túy",
    maintenanceMode: false,
    
    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    twoFactorAuth: false,
    loginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // User Management
    autoApproveUsers: false,
    defaultUserRole: "Member",
    maxUsersPerConsultant: 50,
    
    // System Limits
    maxFileSize: 10,
    maxCourseLength: 120,
    maxSurveyQuestions: 50,
    backupFrequency: "daily"
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    alert("Cài đặt đã được lưu thành công!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h2>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cài đặt</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Cài đặt chung</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên hệ thống
              </label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => handleSettingChange('systemName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả hệ thống
              </label>
              <input
                type="text"
                value={settings.systemDescription}
                onChange={(e) => handleSettingChange('systemDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                Chế độ bảo trì
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Cài đặt bảo mật</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ dài mật khẩu tối thiểu
              </label>
              <input
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="6"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian hết hạn phiên (phút)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="15"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lần đăng nhập sai tối đa
              </label>
              <input
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="3"
                max="10"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                Xác thực hai yếu tố
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Cài đặt thông báo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Thông báo Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                Thông báo SMS
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                Thông báo Push
              </label>
            </div>
          </div>
        </div>

        {/* User Management Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Quản lý người dùng</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò mặc định cho người dùng mới
              </label>
              <select
                value={settings.defaultUserRole}
                onChange={(e) => handleSettingChange('defaultUserRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Guest">Guest</option>
                <option value="Member">Member</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số người dùng tối đa mỗi consultant
              </label>
              <input
                type="number"
                value={settings.maxUsersPerConsultant}
                onChange={(e) => handleSettingChange('maxUsersPerConsultant', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="10"
                max="100"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoApproveUsers"
                checked={settings.autoApproveUsers}
                onChange={(e) => handleSettingChange('autoApproveUsers', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="autoApproveUsers" className="ml-2 block text-sm text-gray-700">
                Tự động phê duyệt người dùng mới
              </label>
            </div>
          </div>
        </div>

        {/* System Limits */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Giới hạn hệ thống</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kích thước file tối đa (MB)
              </label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng khóa học tối đa (phút)
              </label>
              <input
                type="number"
                value={settings.maxCourseLength}
                onChange={(e) => handleSettingChange('maxCourseLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="30"
                max="300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số câu hỏi tối đa trong khảo sát
              </label>
              <input
                type="number"
                value={settings.maxSurveyQuestions}
                onChange={(e) => handleSettingChange('maxSurveyQuestions', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="5"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tần suất backup
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="hourly">Mỗi giờ</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;