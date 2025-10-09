import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FlaskConical,
  ClipboardList,
  Settings,
  FileText,
  Activity,
  Package,
  LogOut,
  TestTube
} from 'lucide-react';
import { useAppContext, UserRole } from '../App';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user', 'service_user']
  },
  {
    id: 'patients',
    label: 'Quản lý Bệnh nhân',
    icon: <Users className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user']
  },
  {
    id: 'test-orders',
    label: 'Lệnh Xét nghiệm',
    icon: <ClipboardList className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user']
  },
  {
    id: 'test-results',
    label: 'Kết quả Xét nghiệm',
    icon: <FlaskConical className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user']
  },
  {
    id: 'instruments',
    label: 'Quản lý Thiết bị',
    icon: <Settings className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user', 'service_user']
  },
  {
    id: 'reagents',
    label: 'Quản lý Thuốc thử',
    icon: <Package className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user']
  },
  {
    id: 'users',
    label: 'Quản lý Người dùng',
    icon: <UserPlus className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager']
  },
  {
    id: 'event-logs',
    label: 'Nhật ký Hệ thống',
    icon: <Activity className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'service_user']
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: <FileText className="w-4 h-4" />,
    roles: ['administrator', 'lab_manager', 'lab_user']
  },
  {
    id: 'my-results',
    label: 'Kết quả của tôi',
    icon: <TestTube className="w-4 h-4" />,
    roles: ['patient']
  }
];

export function Sidebar() {
  const { user, setUser, currentPage, setCurrentPage } = useAppContext();

  if (!user) return null;

  const availableMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  return (
    <div className="w-64 bg-white border-r border-blue-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <TestTube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-blue-900">Lab Management</h2>
            <p className="text-xs text-blue-600">System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-100">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-blue-900 truncate">{user.full_name || 'User'}</p>
            <p className="text-xs text-blue-600 capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {availableMenuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "default" : "ghost"}
            size="sm"
            className={`w-full justify-start ${
              currentPage === item.id 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-blue-700 hover:bg-blue-50'
            }`}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-100">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="ml-2">Đăng xuất</span>
        </Button>
      </div>
    </div>
  );
}