import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Plus, Eye, QrCode, Calendar } from 'lucide-react';

type TestOrder = {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testType: string;
  barcode: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdDate: string;
  completedDate?: string;
  priority: 'normal' | 'urgent' | 'stat';
  doctor: string;
  notes?: string;
};

const mockTestOrders: TestOrder[] = [
  {
    id: '1',
    orderId: 'TO-2024-001',
    patientId: 'P001',
    patientName: 'Nguyễn Văn An',
    testType: 'Công thức máu',
    barcode: '240001001',
    status: 'completed',
    createdDate: '2024-12-25T08:30:00',
    completedDate: '2024-12-25T10:15:00',
    priority: 'normal',
    doctor: 'BS. Trần Văn B'
  },
  {
    id: '2',
    orderId: 'TO-2024-002',
    patientId: 'P002',
    patientName: 'Trần Thị Bình',
    testType: 'Sinh hóa máu',
    barcode: '240001002',
    status: 'processing',
    createdDate: '2024-12-25T09:00:00',
    priority: 'urgent',
    doctor: 'BS. Lê Thị C'
  },
  {
    id: '3',
    orderId: 'TO-2024-003',
    patientId: 'P003',
    patientName: 'Lê Văn Cường',
    testType: 'Đông máu',
    barcode: '240001003',
    status: 'pending',
    createdDate: '2024-12-25T09:30:00',
    priority: 'normal',
    doctor: 'BS. Nguyễn Văn D'
  }
];

const testTypes = [
  'Công thức máu',
  'Sinh hóa máu',
  'Đông máu',
  'Miễn dịch',
  'Vi sinh',
  'Nước tiểu',
  'Hormone'
];

const mockPatients = [
  { id: 'P001', name: 'Nguyễn Văn An' },
  { id: 'P002', name: 'Trần Thị Bình' },
  { id: 'P003', name: 'Lê Văn Cường' }
];

export function TestOrderManagement() {
  const [testOrders, setTestOrders] = useState<TestOrder[]>(mockTestOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredOrders = testOrders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.barcode.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateBarcode = () => {
    const timestamp = Date.now().toString();
    return timestamp.slice(-9);
  };

  const generateOrderId = () => {
    const nextNumber = testOrders.length + 1;
    return `TO-2024-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleAddTestOrder = (formData: FormData) => {
    const selectedPatient = mockPatients.find(p => p.id === formData.get('patientId'));
    
    const newOrder: TestOrder = {
      id: (testOrders.length + 1).toString(),
      orderId: generateOrderId(),
      patientId: formData.get('patientId') as string,
      patientName: selectedPatient?.name || '',
      testType: formData.get('testType') as string,
      barcode: generateBarcode(),
      status: 'pending',
      createdDate: new Date().toISOString(),
      priority: formData.get('priority') as 'normal' | 'urgent' | 'stat',
      doctor: formData.get('doctor') as string,
      notes: formData.get('notes') as string
    };
    
    setTestOrders([...testOrders, newOrder]);
    setIsAddDialogOpen(false);
  };

  const handleViewOrder = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Chờ xử lý</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Đang xử lý</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'stat':
        return <Badge variant="destructive">Cấp cứu</Badge>;
      case 'urgent':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Gấp</Badge>;
      case 'normal':
        return <Badge variant="outline">Thường</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Quản lý Lệnh Xét nghiệm</h1>
          <p className="text-blue-600">Tạo và theo dõi các lệnh xét nghiệm</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-900">Danh sách Lệnh Xét nghiệm</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo lệnh mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tạo lệnh xét nghiệm mới</DialogTitle>
                    <DialogDescription>
                      Nhập thông tin để tạo lệnh xét nghiệm
                    </DialogDescription>
                  </DialogHeader>
                  <form action={handleAddTestOrder} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientId">Bệnh nhân</Label>
                        <Select name="patientId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bệnh nhân" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPatients.map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.id} - {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testType">Loại xét nghiệm</Label>
                        <Select name="testType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại xét nghiệm" />
                          </SelectTrigger>
                          <SelectContent>
                            {testTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Độ ưu tiên</Label>
                        <Select name="priority" defaultValue="normal" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn độ ưu tiên" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Thường</SelectItem>
                            <SelectItem value="urgent">Gấp</SelectItem>
                            <SelectItem value="stat">Cấp cứu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor">Bác sĩ chỉ định</Label>
                        <Input id="doctor" name="doctor" placeholder="Nhập tên bác sĩ" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Ghi chú</Label>
                      <Input id="notes" name="notes" placeholder="Ghi chú thêm (tùy chọn)" />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Tạo lệnh
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex gap-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm lệnh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lệnh</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Loại XN</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-blue-700">{order.orderId}</TableCell>
                    <TableCell>
                      <div>
                        <p>{order.patientName}</p>
                        <p className="text-xs text-gray-500">{order.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.testType}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{order.barcode}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">
                          {new Date(order.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Lệnh Xét nghiệm</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mã lệnh</Label>
                    <p className="text-blue-700">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <Label>Barcode</Label>
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-gray-400" />
                      <p>{selectedOrder.barcode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bệnh nhân</Label>
                    <p>{selectedOrder.patientName} ({selectedOrder.patientId})</p>
                  </div>
                  <div>
                    <Label>Loại xét nghiệm</Label>
                    <p>{selectedOrder.testType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <Label>Độ ưu tiên</Label>
                    <div className="mt-1">{getPriorityBadge(selectedOrder.priority)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ngày tạo</Label>
                    <p>{new Date(selectedOrder.createdDate).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <Label>Bác sĩ chỉ định</Label>
                    <p>{selectedOrder.doctor}</p>
                  </div>
                </div>

                {selectedOrder.completedDate && (
                  <div>
                    <Label>Ngày hoàn thành</Label>
                    <p>{new Date(selectedOrder.completedDate).toLocaleString('vi-VN')}</p>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div>
                    <Label>Ghi chú</Label>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      In nhãn Barcode
                    </Button>
                    <Button variant="outline" size="sm">
                      Chỉnh sửa
                    </Button>
                    {selectedOrder.status === 'pending' && (
                      <Button variant="outline" size="sm" className="text-red-600">
                        Hủy lệnh
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}