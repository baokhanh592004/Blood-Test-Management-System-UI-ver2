import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Settings, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Wrench,
  Activity,
  Calendar,
  Eye
} from 'lucide-react';

type InstrumentStatus = 'ready' | 'processing' | 'maintenance' | 'inactive' | 'error';

type Instrument = {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: InstrumentStatus;
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  totalTests: number;
  todayTests: number;
  uptime: number;
  errorCount: number;
  currentTest?: string;
  testProgress?: number;
};

type MaintenanceRecord = {
  id: string;
  date: string;
  type: 'preventive' | 'corrective' | 'calibration';
  description: string;
  technician: string;
  status: 'completed' | 'pending' | 'in_progress';
};

const mockInstruments: Instrument[] = [
  {
    id: '1',
    name: 'Hematology Analyzer A',
    model: 'HA-8000',
    serialNumber: 'HA001234',
    status: 'ready',
    location: 'Lab Room 1',
    lastMaintenance: '2024-12-01T00:00:00',
    nextMaintenance: '2025-01-01T00:00:00',
    totalTests: 15420,
    todayTests: 45,
    uptime: 98.5,
    errorCount: 2
  },
  {
    id: '2',
    name: 'Chemistry Analyzer B',
    model: 'CA-5000',
    serialNumber: 'CA005678',
    status: 'processing',
    location: 'Lab Room 2',
    lastMaintenance: '2024-11-15T00:00:00',
    nextMaintenance: '2024-12-15T00:00:00',
    totalTests: 23150,
    todayTests: 32,
    uptime: 95.2,
    errorCount: 1,
    currentTest: 'TO-2024-002',
    testProgress: 65
  },
  {
    id: '3',
    name: 'Coagulation Analyzer',
    model: 'COA-3000',
    serialNumber: 'COA009012',
    status: 'maintenance',
    location: 'Lab Room 3',
    lastMaintenance: '2024-12-20T00:00:00',
    nextMaintenance: '2025-01-20T00:00:00',
    totalTests: 8750,
    todayTests: 0,
    uptime: 92.8,
    errorCount: 0
  },
  {
    id: '4',
    name: 'Immunology Analyzer',
    model: 'IA-4000',
    serialNumber: 'IA003456',
    status: 'inactive',
    location: 'Lab Room 4',
    lastMaintenance: '2024-10-01T00:00:00',
    nextMaintenance: '2024-11-01T00:00:00',
    totalTests: 12300,
    todayTests: 0,
    uptime: 0,
    errorCount: 5
  },
  {
    id: '5',
    name: 'Microbiology Analyzer',
    model: 'MA-2000',
    serialNumber: 'MA007890',
    status: 'error',
    location: 'Lab Room 5',
    lastMaintenance: '2024-12-10T00:00:00',
    nextMaintenance: '2025-01-10T00:00:00',
    totalTests: 5680,
    todayTests: 12,
    uptime: 85.3,
    errorCount: 3
  }
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    date: '2024-12-25T09:00:00',
    type: 'corrective',
    description: 'Sửa chữa lỗi sensor nhiệt độ',
    technician: 'Nguyễn Văn Sửa',
    status: 'in_progress'
  },
  {
    id: '2',
    date: '2024-12-24T14:30:00',
    type: 'preventive',
    description: 'Bảo trì định kỳ hệ thống hydraulic',
    technician: 'Trần Thị Bảo',
    status: 'completed'
  },
  {
    id: '3',
    date: '2024-12-23T08:15:00',
    type: 'calibration',
    description: 'Hiệu chuẩn hệ thống đo quang phổ',
    technician: 'Lê Văn Chuẩn',
    status: 'completed'
  }
];

export function InstrumentManagement() {
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [maintenanceRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);

  const handleViewDetails = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsDetailDialogOpen(true);
  };

  const handleToggleStatus = (instrumentId: string) => {
    setInstruments(prev => prev.map(instrument => {
      if (instrument.id === instrumentId) {
        const newStatus = instrument.status === 'ready' ? 'inactive' : 'ready';
        return { ...instrument, status: newStatus };
      }
      return instrument;
    }));
  };

  const getStatusBadge = (status: InstrumentStatus) => {
    const statusConfig = {
      ready: { label: 'Sẵn sàng', className: 'bg-green-100 text-green-700', icon: CheckCircle },
      processing: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-700', icon: Activity },
      maintenance: { label: 'Bảo trì', className: 'bg-yellow-100 text-yellow-700', icon: Wrench },
      inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-700', icon: Pause },
      error: { label: 'Lỗi', className: 'bg-red-100 text-red-700', icon: AlertTriangle }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant="secondary" className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getMaintenanceTypeBadge = (type: MaintenanceRecord['type']) => {
    const typeConfig = {
      preventive: { label: 'Định kỳ', className: 'bg-blue-100 text-blue-700' },
      corrective: { label: 'Sửa chữa', className: 'bg-orange-100 text-orange-700' },
      calibration: { label: 'Hiệu chuẩn', className: 'bg-purple-100 text-purple-700' }
    };

    const config = typeConfig[type];
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getMaintenanceStatusBadge = (status: MaintenanceRecord['status']) => {
    const statusConfig = {
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-700' },
      pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-700' },
      in_progress: { label: 'Đang thực hiện', className: 'bg-blue-100 text-blue-700' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Quản lý Thiết bị</h1>
          <p className="text-blue-600">Theo dõi trạng thái và bảo trì thiết bị phòng thí nghiệm</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Hoạt động tốt</p>
                  <p className="text-xl text-green-700">
                    {instruments.filter(i => i.status === 'ready').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Đang xử lý</p>
                  <p className="text-xl text-blue-700">
                    {instruments.filter(i => i.status === 'processing').length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Bảo trì</p>
                  <p className="text-xl text-yellow-700">
                    {instruments.filter(i => i.status === 'maintenance').length}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Cần sửa chữa</p>
                  <p className="text-xl text-red-700">
                    {instruments.filter(i => i.status === 'error' || i.status === 'inactive').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instruments Table */}
        <Card className="border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Danh sách Thiết bị</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thiết bị</TableHead>
                  <TableHead>Model/Serial</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Xét nghiệm hôm nay</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instruments.map((instrument) => (
                  <TableRow key={instrument.id}>
                    <TableCell>
                      <div>
                        <p>{instrument.name}</p>
                        {instrument.currentTest && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">
                              Đang xử lý: {instrument.currentTest}
                            </p>
                            <Progress value={instrument.testProgress} className="h-1 mt-1" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{instrument.model}</p>
                        <p className="text-xs text-gray-500">{instrument.serialNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(instrument.status)}</TableCell>
                    <TableCell>{instrument.location}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="text-lg">{instrument.todayTests}</p>
                        <p className="text-xs text-gray-500">tests</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{instrument.uptime}%</p>
                        <Progress value={instrument.uptime} className="h-1 mt-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(instrument)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(instrument.id)}
                          disabled={instrument.status === 'processing' || instrument.status === 'maintenance'}
                        >
                          {instrument.status === 'ready' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Maintenance Records */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Lịch sử Bảo trì</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Kỹ thuật viên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(record.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getMaintenanceTypeBadge(record.type)}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.technician}</TableCell>
                    <TableCell>{getMaintenanceStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Instrument Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Thiết bị</DialogTitle>
              <DialogDescription>
                {selectedInstrument?.name} - {selectedInstrument?.model}
              </DialogDescription>
            </DialogHeader>
            {selectedInstrument && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <label className="text-sm text-gray-600">Tên thiết bị</label>
                    <p>{selectedInstrument.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Model</label>
                    <p>{selectedInstrument.model}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Serial Number</label>
                    <p>{selectedInstrument.serialNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Vị trí</label>
                    <p>{selectedInstrument.location}</p>
                  </div>
                </div>

                {/* Status & Performance */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Trạng thái hiện tại</p>
                        <div className="mt-2">
                          {getStatusBadge(selectedInstrument.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Uptime</p>
                        <p className="text-2xl text-blue-700">{selectedInstrument.uptime}%</p>
                        <Progress value={selectedInstrument.uptime} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Số lỗi</p>
                        <p className="text-2xl text-red-700">{selectedInstrument.errorCount}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Test Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="text-blue-900 mb-3">Thống kê Xét nghiệm</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Tổng số test:</span>
                          <span className="text-blue-700">{selectedInstrument.totalTests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Test hôm nay:</span>
                          <span className="text-blue-700">{selectedInstrument.todayTests}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h5 className="text-blue-900 mb-3">Bảo trì</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Lần cuối:</span>
                          <span>{new Date(selectedInstrument.lastMaintenance).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kế tiếp:</span>
                          <span>{new Date(selectedInstrument.nextMaintenance).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Test Progress */}
                {selectedInstrument.currentTest && (
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="text-blue-900 mb-3">Test đang thực hiện</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Mã test:</span>
                          <span className="text-blue-700">{selectedInstrument.currentTest}</span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Tiến độ:</span>
                            <span>{selectedInstrument.testProgress}%</span>
                          </div>
                          <Progress value={selectedInstrument.testProgress} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Wrench className="w-4 h-4 mr-2" />
                    Lên lịch bảo trì
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Cấu hình
                  </Button>
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Lịch sử hoạt động
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}