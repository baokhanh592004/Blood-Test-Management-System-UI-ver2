import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { 
  Search, 
  Download, 
  Filter, 
  Calendar,
  User,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Activity
} from 'lucide-react';

type EventType = 'login' | 'logout' | 'test_created' | 'test_completed' | 'user_created' | 'user_updated' | 
  'instrument_status' | 'reagent_updated' | 'system_config' | 'error' | 'warning' | 'info';

type EventLog = {
  id: string;
  timestamp: string;
  eventType: EventType;
  action: string;
  user: string;
  userRole: string;
  module: string;
  details: string;
  ipAddress?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'warning';
};

const mockEventLogs: EventLog[] = [
  {
    id: '1',
    timestamp: '2024-12-25T10:30:15Z',
    eventType: 'test_completed',
    action: 'Test Order completed',
    user: 'KTV. Trần Thị Lan',
    userRole: 'lab_user',
    module: 'Test Management',
    details: 'Test Order TO-2024-001 completed successfully for patient P001',
    ipAddress: '192.168.1.105',
    severity: 'low',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2024-12-25T10:15:32Z',
    eventType: 'login',
    action: 'User login',
    user: 'BS. Nguyễn Văn Manager',
    userRole: 'lab_manager',
    module: 'Authentication',
    details: 'Successful login from desktop application',
    ipAddress: '192.168.1.102',
    severity: 'low',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2024-12-25T09:45:18Z',
    eventType: 'instrument_status',
    action: 'Instrument status changed',
    user: 'System',
    userRole: 'system',
    module: 'Instrument Management',
    details: 'Chemistry Analyzer B status changed from Ready to Processing',
    severity: 'low',
    status: 'success'
  },
  {
    id: '4',
    timestamp: '2024-12-25T09:30:45Z',
    eventType: 'test_created',
    action: 'Test Order created',
    user: 'KTV. Lê Văn Minh',
    userRole: 'lab_user',
    module: 'Test Management',
    details: 'New test order TO-2024-003 created for patient P003 - Coagulation test',
    ipAddress: '192.168.1.106',
    severity: 'low',
    status: 'success'
  },
  {
    id: '5',
    timestamp: '2024-12-25T09:00:12Z',
    eventType: 'error',
    action: 'Instrument error',
    user: 'System',
    userRole: 'system',
    module: 'Instrument Management',
    details: 'Microbiology Analyzer MA-2000 reported sensor calibration error',
    severity: 'high',
    status: 'failed'
  },
  {
    id: '6',
    timestamp: '2024-12-25T08:45:33Z',
    eventType: 'user_created',
    action: 'User account created',
    user: 'Admin User',
    userRole: 'administrator',
    module: 'User Management',
    details: 'New lab technician account created: tech3@lab.com',
    ipAddress: '192.168.1.101',
    severity: 'medium',
    status: 'success'
  },
  {
    id: '7',
    timestamp: '2024-12-25T08:30:21Z',
    eventType: 'reagent_updated',
    action: 'Reagent stock updated',
    user: 'KTV. Trần Thị Lan',
    userRole: 'lab_user',
    module: 'Reagent Management',
    details: 'Glucose Oxidase Kit (GLU-002) stock reduced to 25 tests - below minimum threshold',
    ipAddress: '192.168.1.105',
    severity: 'medium',
    status: 'warning'
  },
  {
    id: '8',
    timestamp: '2024-12-25T08:15:44Z',
    eventType: 'system_config',
    action: 'System configuration updated',
    user: 'Admin User',
    userRole: 'administrator',
    module: 'System Configuration',
    details: 'Updated flagging rules for critical values',
    ipAddress: '192.168.1.101',
    severity: 'medium',
    status: 'success'
  },
  {
    id: '9',
    timestamp: '2024-12-25T07:45:16Z',
    eventType: 'login',
    action: 'Failed login attempt',
    user: 'Unknown',
    userRole: 'unknown',
    module: 'Authentication',
    details: 'Failed login attempt with email: test@lab.com - Invalid credentials',
    ipAddress: '192.168.1.200',
    severity: 'medium',
    status: 'failed'
  },
  {
    id: '10',
    timestamp: '2024-12-24T23:30:00Z',
    eventType: 'warning',
    action: 'Automated backup',
    user: 'System',
    userRole: 'system',
    module: 'System Maintenance',
    details: 'Daily backup completed with warnings - some files skipped due to lock',
    severity: 'low',
    status: 'warning'
  }
];

const eventTypeLabels = {
  login: 'Đăng nhập',
  logout: 'Đăng xuất',
  test_created: 'Tạo XN',
  test_completed: 'Hoàn thành XN',
  user_created: 'Tạo người dùng',
  user_updated: 'Cập nhật người dùng',
  instrument_status: 'Trạng thái thiết bị',
  reagent_updated: 'Cập nhật thuốc thử',
  system_config: 'Cấu hình hệ thống',
  error: 'Lỗi',
  warning: 'Cảnh báo',
  info: 'Thông tin'
};

const modules = [
  'Authentication',
  'Test Management', 
  'User Management',
  'Instrument Management',
  'Reagent Management',
  'System Configuration',
  'System Maintenance'
];

export function EventLogs() {
  const [eventLogs] = useState<EventLog[]>(mockEventLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLogs = eventLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEventType = eventTypeFilter === 'all' || log.eventType === eventTypeFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesEventType && matchesModule && matchesSeverity && matchesStatus;
  });

  const getEventTypeIcon = (eventType: EventType) => {
    const iconMap = {
      login: User,
      logout: User,
      test_created: Activity,
      test_completed: CheckCircle,
      user_created: User,
      user_updated: User,
      instrument_status: Settings,
      reagent_updated: Activity,
      system_config: Settings,
      error: XCircle,
      warning: AlertTriangle,
      info: Info
    };
    
    const IconComponent = iconMap[eventType] || Activity;
    return <IconComponent className="w-4 h-4" />;
  };

  const getEventTypeBadge = (eventType: EventType) => {
    const colorMap = {
      login: 'bg-blue-100 text-blue-700',
      logout: 'bg-gray-100 text-gray-700',
      test_created: 'bg-green-100 text-green-700',
      test_completed: 'bg-green-100 text-green-700',
      user_created: 'bg-purple-100 text-purple-700',
      user_updated: 'bg-purple-100 text-purple-700',
      instrument_status: 'bg-orange-100 text-orange-700',
      reagent_updated: 'bg-orange-100 text-orange-700',
      system_config: 'bg-blue-100 text-blue-700',
      error: 'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700',
      info: 'bg-blue-100 text-blue-700'
    };

    return (
      <Badge variant="secondary" className={colorMap[eventType]}>
        {getEventTypeIcon(eventType)}
        <span className="ml-1">{eventTypeLabels[eventType]}</span>
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { label: 'Thấp', className: 'bg-green-100 text-green-700' },
      medium: { label: 'Trung bình', className: 'bg-yellow-100 text-yellow-700' },
      high: { label: 'Cao', className: 'bg-orange-100 text-orange-700' },
      critical: { label: 'Nghiêm trọng', className: 'bg-red-100 text-red-700' }
    };

    const config = severityConfig[severity as keyof typeof severityConfig];
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Thành công', className: 'bg-green-100 text-green-700' },
      failed: { label: 'Thất bại', className: 'bg-red-100 text-red-700' },
      warning: { label: 'Cảnh báo', className: 'bg-yellow-100 text-yellow-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Timestamp', 'Event Type', 'Action', 'User', 'Module', 'Status', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        eventTypeLabels[log.eventType],
        log.action,
        log.user,
        log.module,
        log.status,
        log.details
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Nhật ký Hệ thống</h1>
          <p className="text-blue-600">Theo dõi tất cả hoạt động và sự kiện trong hệ thống</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-900">Nhật ký Sự kiện</CardTitle>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Xuất CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả module</SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức độ</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="critical">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </div>

            {/* Summary */}
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-600">Tổng sự kiện</p>
                <p className="text-xl text-blue-900">{filteredLogs.length}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <p className="text-sm text-green-600">Thành công</p>
                <p className="text-xl text-green-900">
                  {filteredLogs.filter(log => log.status === 'success').length}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <p className="text-sm text-red-600">Lỗi</p>
                <p className="text-xl text-red-900">
                  {filteredLogs.filter(log => log.status === 'failed').length}
                </p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <p className="text-sm text-yellow-600">Cảnh báo</p>
                <p className="text-xl text-yellow-900">
                  {filteredLogs.filter(log => log.status === 'warning').length}
                </p>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại sự kiện</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm">
                            {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getEventTypeBadge(log.eventType)}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{log.user}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {log.userRole.replace('_', ' ')}
                        </p>
                        {log.ipAddress && (
                          <p className="text-xs text-gray-400">{log.ipAddress}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate" title={log.details}>
                          {log.details}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy sự kiện nào phù hợp với bộ lọc</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}