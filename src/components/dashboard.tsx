import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  ClipboardList, 
  FlaskConical, 
  Settings, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAppContext } from '../App';

export function Dashboard() {
  const { user } = useAppContext();

  if (!user) return null;

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'administrator':
        return <AdminDashboard />;
      case 'lab_manager':
        return <LabManagerDashboard />;
      case 'lab_user':
        return <LabUserDashboard />;
      case 'service_user':
        return <ServiceUserDashboard />;
      case 'patient':
        return <PatientDashboard />;
      default:
        return <LabUserDashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Tổng quan</h1>
          <p className="text-blue-600">Chào mừng {user.full_name || 'User'}</p>
        </div>
        {renderDashboardByRole()}
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng Người dùng</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-900">124</div>
            <p className="text-xs text-blue-600">+12% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Xét nghiệm hôm nay</CardTitle>
            <FlaskConical className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-900">89</div>
            <p className="text-xs text-blue-600">+5% so với hôm qua</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Thiết bị hoạt động</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-900">8/10</div>
            <p className="text-xs text-green-600">Trạng thái tốt</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Hiệu suất</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-900">94%</div>
            <p className="text-xs text-blue-600">Tăng 2% tuần này</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Trạng thái Hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Hoạt động
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Services</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Hoạt động
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup Status</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                <Clock className="w-3 h-3 mr-1" />
                Đang xử lý
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LabManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Lab Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">Lệnh xét nghiệm hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-900 mb-2">64</div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-blue-600 mt-2">75% hoàn thành</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">Thiết bị đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-900 mb-2">6/8</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Analyzer A</span>
                <Badge className="bg-green-100 text-green-700 text-xs">Ready</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Analyzer B</span>
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">Maintenance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">Thuốc thử cần bổ sung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600 mb-2">3</div>
            <p className="text-xs text-orange-600">Cần đặt hàng</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Test Order #2024-001 hoàn thành</span>
              <span className="text-xs text-gray-500">5 phút trước</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Analyzer B cần bảo trì</span>
              <span className="text-xs text-gray-500">15 phút trước</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Người dùng mới được tạo</span>
              <span className="text-xs text-gray-500">1 giờ trước</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LabUserDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
          <CardHeader className="text-center">
            <ClipboardList className="w-8 h-8 text-blue-600 mx-auto" />
            <CardTitle className="text-sm">Tạo lệnh XN mới</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
          <CardHeader className="text-center">
            <FlaskConical className="w-8 h-8 text-blue-600 mx-auto" />
            <CardTitle className="text-sm">Xem kết quả</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
          <CardHeader className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto" />
            <CardTitle className="text-sm">Quản lý bệnh nhân</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
          <CardHeader className="text-center">
            <Settings className="w-8 h-8 text-blue-600 mx-auto" />
            <CardTitle className="text-sm">Trạng thái thiết bị</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Current Workload */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Khối lượng công việc hôm nay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600">Lệnh chờ xử lý</p>
              <p className="text-2xl text-blue-900">12</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Đã hoàn thành</p>
              <p className="text-2xl text-green-600">45</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServiceUserDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Trạng thái Thiết bị</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Hematology Analyzer A</span>
              <Badge className="bg-green-100 text-green-700">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Chemistry Analyzer B</span>
              <Badge className="bg-yellow-100 text-yellow-700">Maintenance Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Coagulation Analyzer</span>
              <Badge className="bg-red-100 text-red-700">Inactive</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PatientDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Kết quả Xét nghiệm gần đây</CardTitle>
          <CardDescription>Xem kết quả xét nghiệm của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-blue-100 rounded">
              <div>
                <p className="text-sm">Công thức máu</p>
                <p className="text-xs text-gray-500">25/12/2024</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-blue-100 rounded">
              <div>
                <p className="text-sm">Sinh hóa máu</p>
                <p className="text-xs text-gray-500">20/12/2024</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}