import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingDown,
  Eye,
  Edit,
  Calendar
} from 'lucide-react';

type ReagentStatus = 'available' | 'low_stock' | 'expired' | 'out_of_stock';

type Reagent = {
  id: string;
  name: string;
  code: string;
  supplier: string;
  lotNumber: string;
  quantity: number;
  unit: string;
  minStock: number;
  expiryDate: string;
  receivedDate: string;
  status: ReagentStatus;
  storageCondition: string;
  usedQuantity: number;
  cost: number;
  category: string;
};

type UsageHistory = {
  id: string;
  reagentId: string;
  testOrderId: string;
  patientName: string;
  quantityUsed: number;
  usageDate: string;
  usedBy: string;
};

const mockReagents: Reagent[] = [
  {
    id: '1',
    name: 'Hemoglobin Reagent',
    code: 'HGB-001',
    supplier: 'BioTech Corp',
    lotNumber: 'LOT2024001',
    quantity: 150,
    unit: 'mL',
    minStock: 50,
    expiryDate: '2025-06-30',
    receivedDate: '2024-01-15',
    status: 'available',
    storageCondition: '2-8°C',
    usedQuantity: 75,
    cost: 2500000,
    category: 'Hematology'
  },
  {
    id: '2',
    name: 'Glucose Oxidase Kit',
    code: 'GLU-002',
    supplier: 'MedLab Solutions',
    lotNumber: 'LOT2024002',
    quantity: 25,
    unit: 'tests',
    minStock: 50,
    expiryDate: '2025-03-15',
    receivedDate: '2024-02-01',
    status: 'low_stock',
    storageCondition: 'Room temp',
    usedQuantity: 275,
    cost: 1800000,
    category: 'Chemistry'
  },
  {
    id: '3',
    name: 'PT/INR Reagent',
    code: 'PT-003',
    supplier: 'CoagTech Ltd',
    lotNumber: 'LOT2024003',
    quantity: 0,
    unit: 'tests',
    minStock: 100,
    expiryDate: '2024-12-20',
    receivedDate: '2024-06-01',
    status: 'expired',
    storageCondition: '2-8°C',
    usedQuantity: 500,
    cost: 3200000,
    category: 'Coagulation'
  },
  {
    id: '4',
    name: 'Creatinine Kit',
    code: 'CRE-004',
    supplier: 'BioTech Corp',
    lotNumber: 'LOT2024004',
    quantity: 200,
    unit: 'tests',
    minStock: 75,
    expiryDate: '2025-08-30',
    receivedDate: '2024-03-10',
    status: 'available',
    storageCondition: 'Room temp',
    usedQuantity: 100,
    cost: 2100000,
    category: 'Chemistry'
  },
  {
    id: '5',
    name: 'Platelet Count Buffer',
    code: 'PLT-005',
    supplier: 'HemaTech Inc',
    lotNumber: 'LOT2024005',
    quantity: 0,
    unit: 'mL',
    minStock: 100,
    expiryDate: '2025-04-15',
    receivedDate: '2024-04-01',
    status: 'out_of_stock',
    storageCondition: '2-8°C',
    usedQuantity: 500,
    cost: 1900000,
    category: 'Hematology'
  }
];

const mockUsageHistory: UsageHistory[] = [
  {
    id: '1',
    reagentId: '1',
    testOrderId: 'TO-2024-001',
    patientName: 'Nguyễn Văn An',
    quantityUsed: 5,
    usageDate: '2024-12-25T10:15:00',
    usedBy: 'KTV. Trần Thị Lan'
  },
  {
    id: '2',
    reagentId: '2',
    testOrderId: 'TO-2024-002',
    patientName: 'Trần Thị Bình',
    quantityUsed: 1,
    usageDate: '2024-12-25T11:30:00',
    usedBy: 'KTV. Lê Văn Minh'
  }
];

const categories = ['Hematology', 'Chemistry', 'Coagulation', 'Immunology', 'Microbiology'];
const suppliers = ['BioTech Corp', 'MedLab Solutions', 'CoagTech Ltd', 'HemaTech Inc'];

export function ReagentManagement() {
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [usageHistory] = useState<UsageHistory[]>(mockUsageHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredReagents = reagents.filter(reagent => {
    const matchesSearch = reagent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reagent.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reagent.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reagent.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || reagent.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddReagent = (formData: FormData) => {
    const newReagent: Reagent = {
      id: (reagents.length + 1).toString(),
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      supplier: formData.get('supplier') as string,
      lotNumber: formData.get('lotNumber') as string,
      quantity: parseInt(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      minStock: parseInt(formData.get('minStock') as string),
      expiryDate: formData.get('expiryDate') as string,
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'available',
      storageCondition: formData.get('storageCondition') as string,
      usedQuantity: 0,
      cost: parseFloat(formData.get('cost') as string),
      category: formData.get('category') as string
    };
    
    setReagents([...reagents, newReagent]);
    setIsAddDialogOpen(false);
  };

  const handleViewDetails = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: ReagentStatus, quantity: number, minStock: number) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }
    if (status === 'out_of_stock' || quantity === 0) {
      return <Badge variant="destructive">Hết hàng</Badge>;
    }
    if (quantity <= minStock) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Sắp hết</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-700">Còn đủ</Badge>;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { color: 'text-red-600', text: 'Đã hết hạn' };
    if (days <= 30) return { color: 'text-orange-600', text: `${days} ngày` };
    if (days <= 90) return { color: 'text-yellow-600', text: `${days} ngày` };
    return { color: 'text-green-600', text: `${days} ngày` };
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Quản lý Thuốc thử</h1>
          <p className="text-blue-600">Quản lý kho thuốc thử và theo dõi tồn kho</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Còn đủ</p>
                  <p className="text-xl text-green-700">
                    {reagents.filter(r => r.quantity > r.minStock && r.status === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Sắp hết</p>
                  <p className="text-xl text-yellow-700">
                    {reagents.filter(r => r.quantity <= r.minStock && r.quantity > 0).length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Hết hàng</p>
                  <p className="text-xl text-red-700">
                    {reagents.filter(r => r.quantity === 0).length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Hết hạn</p>
                  <p className="text-xl text-orange-700">
                    {reagents.filter(r => getDaysUntilExpiry(r.expiryDate) < 0).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-900">Danh sách Thuốc thử</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nhập thuốc thử
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nhập thuốc thử mới</DialogTitle>
                    <DialogDescription>
                      Thêm thuốc thử vào kho
                    </DialogDescription>
                  </DialogHeader>
                  <form action={handleAddReagent} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tên thuốc thử</Label>
                        <Input id="name" name="name" placeholder="Nhập tên thuốc thử" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Mã thuốc thử</Label>
                        <Input id="code" name="code" placeholder="Nhập mã thuốc thử" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Nhà cung cấp</Label>
                        <Select name="supplier" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map(supplier => (
                              <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Danh mục</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lotNumber">Lot Number</Label>
                        <Input id="lotNumber" name="lotNumber" placeholder="LOT number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Số lượng</Label>
                        <Input id="quantity" name="quantity" type="number" placeholder="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Đơn vị</Label>
                        <Input id="unit" name="unit" placeholder="mL, tests, etc." required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minStock">Tồn kho tối thiểu</Label>
                        <Input id="minStock" name="minStock" type="number" placeholder="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Giá (VND)</Label>
                        <Input id="cost" name="cost" type="number" placeholder="0" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                        <Input id="expiryDate" name="expiryDate" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="storageCondition">Điều kiện bảo quản</Label>
                        <Input id="storageCondition" name="storageCondition" placeholder="2-8°C, Room temp" required />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Thêm vào kho
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
                  placeholder="Tìm kiếm thuốc thử..."
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
                  <SelectItem value="available">Còn đủ</SelectItem>
                  <SelectItem value="low_stock">Sắp hết</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc thử</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReagents.map((reagent) => {
                  const expiryStatus = getExpiryStatus(reagent.expiryDate);
                  return (
                    <TableRow key={reagent.id}>
                      <TableCell>
                        <div>
                          <p>{reagent.name}</p>
                          <p className="text-xs text-gray-500">{reagent.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>{reagent.lotNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p>{reagent.quantity} {reagent.unit}</p>
                          <p className="text-xs text-gray-500">Min: {reagent.minStock}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reagent.status, reagent.quantity, reagent.minStock)}
                      </TableCell>
                      <TableCell>
                        <div className={expiryStatus.color}>
                          <p className="text-sm">{new Date(reagent.expiryDate).toLocaleDateString('vi-VN')}</p>
                          <p className="text-xs">{expiryStatus.text}</p>
                        </div>
                      </TableCell>
                      <TableCell>{reagent.supplier}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(reagent)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Reagent Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Thuốc thử</DialogTitle>
              <DialogDescription>
                {selectedReagent?.name} - {selectedReagent?.code}
              </DialogDescription>
            </DialogHeader>
            {selectedReagent && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <Label>Tên thuốc thử</Label>
                    <p>{selectedReagent.name}</p>
                  </div>
                  <div>
                    <Label>Mã thuốc thử</Label>
                    <p>{selectedReagent.code}</p>
                  </div>
                  <div>
                    <Label>Nhà cung cấp</Label>
                    <p>{selectedReagent.supplier}</p>
                  </div>
                  <div>
                    <Label>Danh mục</Label>
                    <p>{selectedReagent.category}</p>
                  </div>
                </div>

                {/* Stock Info */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Tồn kho hiện tại</p>
                        <p className="text-2xl text-blue-700">{selectedReagent.quantity} {selectedReagent.unit}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Đã sử dụng</p>
                        <p className="text-2xl text-green-700">{selectedReagent.usedQuantity} {selectedReagent.unit}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Tồn kho tối thiểu</p>
                        <p className="text-2xl text-orange-700">{selectedReagent.minStock} {selectedReagent.unit}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Expiry & Storage */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="text-blue-900 mb-3">Thông tin hết hạn</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Ngày hết hạn:</span>
                          <span>{new Date(selectedReagent.expiryDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Còn lại:</span>
                          <span className={getExpiryStatus(selectedReagent.expiryDate).color}>
                            {getExpiryStatus(selectedReagent.expiryDate).text}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="text-blue-900 mb-3">Thông tin bảo quản</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Điều kiện:</span>
                          <span>{selectedReagent.storageCondition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ngày nhập:</span>
                          <span>{new Date(selectedReagent.receivedDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Usage History */}
                <Card>
                  <CardContent className="p-4">
                    <h5 className="text-blue-900 mb-3">Lịch sử sử dụng gần đây</h5>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Test Order</TableHead>
                          <TableHead>Bệnh nhân</TableHead>
                          <TableHead>Số lượng</TableHead>
                          <TableHead>Người sử dụng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usageHistory
                          .filter(usage => usage.reagentId === selectedReagent.id)
                          .map((usage) => (
                            <TableRow key={usage.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm">
                                    {new Date(usage.usageDate).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{usage.testOrderId}</TableCell>
                              <TableCell>{usage.patientName}</TableCell>
                              <TableCell>{usage.quantityUsed} {selectedReagent.unit}</TableCell>
                              <TableCell>{usage.usedBy}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}