import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Search, Plus, Edit, Eye, Calendar, Loader2 } from 'lucide-react';
import { PatientWithTestOrders, Gender } from '../types/database';
import { ApiService } from '../services/api';

export function PatientManagement() {
  const [patients, setPatients] = useState<PatientWithTestOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithTestOrders | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Load patients from API
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPatients({ search: searchTerm });
      if (response.data) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPatients();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddPatient = async (formData: FormData) => {
    try {
      const patientData = {
        full_name: formData.get('name') as string,
        dob: formData.get('dateOfBirth') as string,
        gender: formData.get('gender') as Gender,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string
      };
      
      const response = await ApiService.createPatient(patientData);
      if (response.data) {
        await loadPatients(); // Reload the list
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create patient:', error);
    }
  };

  const handleViewPatient = (patient: PatientWithTestOrders) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Quản lý Bệnh nhân</h1>
          <p className="text-blue-600">Quản lý thông tin bệnh nhân và lịch sử xét nghiệm</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-900">Danh sách Bệnh nhân</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bệnh nhân
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thêm bệnh nhân mới</DialogTitle>
                    <DialogDescription>
                      Nhập thông tin chi tiết của bệnh nhân
                    </DialogDescription>
                  </DialogHeader>
                  <form action={handleAddPatient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" name="name" placeholder="Nhập họ tên" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <select id="gender" name="gender" className="w-full p-2 border rounded-md" required>
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" name="phone" placeholder="Nhập số điện thoại" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="Nhập email" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input id="address" name="address" placeholder="Nhập địa chỉ đầy đủ" required />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Thêm bệnh nhân
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bệnh nhân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Đang tải dữ liệu...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã BN</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="text-blue-700">{patient.patient_code}</TableCell>
                      <TableCell>{patient.full_name}</TableCell>
                      <TableCell>
                        {patient.dob ? new Date(patient.dob).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {patient.gender === 'male' ? 'Nam' : 
                         patient.gender === 'female' ? 'Nữ' : 
                         patient.gender || 'N/A'}
                      </TableCell>
                      <TableCell>{patient.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(patient.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {patients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Không tìm thấy bệnh nhân nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Patient Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Bệnh nhân</DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mã bệnh nhân</Label>
                    <p className="text-blue-700">{selectedPatient.patient_code}</p>
                  </div>
                  <div>
                    <Label>Họ và tên</Label>
                    <p>{selectedPatient.full_name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ngày sinh</Label>
                    <p>{selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <p>
                      {selectedPatient.gender === 'male' ? 'Nam' : 
                       selectedPatient.gender === 'female' ? 'Nữ' : 
                       selectedPatient.gender || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Số điện thoại</Label>
                    <p>{selectedPatient.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Ngày tạo</Label>
                    <p>{new Date(selectedPatient.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                <div>
                  <Label>Địa chỉ</Label>
                  <p>{selectedPatient.address || 'N/A'}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-blue-900 mb-3">Lịch sử Xét nghiệm</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-blue-100 rounded">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm">Công thức máu</p>
                          <p className="text-xs text-gray-500">25/12/2024</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-blue-100 rounded">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm">Sinh hóa máu</p>
                          <p className="text-xs text-gray-500">20/12/2024</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
                    </div>
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