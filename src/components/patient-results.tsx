import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Calendar, 
  Download, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';

type TestParameter = {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'high' | 'low' | 'critical';
};

type PatientTestResult = {
  id: string;
  orderId: string;
  testType: string;
  testDate: string;
  completedDate: string;
  status: 'completed' | 'pending' | 'in_progress';
  parameters: TestParameter[];
  doctor: string;
  notes?: string;
  reportUrl?: string;
};

const mockPatientResults: PatientTestResult[] = [
  {
    id: '1',
    orderId: 'TO-2024-001',
    testType: 'Công thức máu',
    testDate: '2024-12-25T08:30:00',
    completedDate: '2024-12-25T10:15:00',
    status: 'completed',
    doctor: 'BS. Trần Văn B',
    parameters: [
      { name: 'WBC (Bạch cầu)', value: 8.2, unit: '10³/μL', referenceRange: '4.0 - 10.0', flag: 'normal' },
      { name: 'RBC (Hồng cầu)', value: 4.8, unit: '10⁶/μL', referenceRange: '4.5 - 5.5', flag: 'normal' },
      { name: 'Hemoglobin', value: 15.2, unit: 'g/dL', referenceRange: '13.0 - 16.0', flag: 'normal' },
      { name: 'Hematocrit', value: 45.8, unit: '%', referenceRange: '40.0 - 50.0', flag: 'normal' },
      { name: 'Platelet (Tiểu cầu)', value: 320, unit: '10³/μL', referenceRange: '150 - 400', flag: 'normal' },
      { name: 'MCV', value: 88, unit: 'fL', referenceRange: '82 - 98', flag: 'normal' },
      { name: 'MCH', value: 30, unit: 'pg', referenceRange: '27 - 32', flag: 'normal' },
      { name: 'MCHC', value: 34, unit: 'g/dL', referenceRange: '32 - 36', flag: 'normal' }
    ],
    notes: 'Kết quả trong giới hạn bình thường'
  },
  {
    id: '2',
    orderId: 'TO-2024-015',
    testType: 'Sinh hóa máu',
    testDate: '2024-12-20T09:00:00',
    completedDate: '2024-12-20T11:30:00',
    status: 'completed',
    doctor: 'BS. Lê Thị C',
    parameters: [
      { name: 'Glucose (Đường huyết)', value: 95, unit: 'mg/dL', referenceRange: '70 - 110', flag: 'normal' },
      { name: 'Cholesterol tổng', value: 185, unit: 'mg/dL', referenceRange: '< 200', flag: 'normal' },
      { name: 'Triglycerides', value: 95, unit: 'mg/dL', referenceRange: '< 150', flag: 'normal' },
      { name: 'HDL-C', value: 55, unit: 'mg/dL', referenceRange: '> 40', flag: 'normal' },
      { name: 'LDL-C', value: 115, unit: 'mg/dL', referenceRange: '< 130', flag: 'normal' },
      { name: 'Creatinine', value: 0.9, unit: 'mg/dL', referenceRange: '0.6 - 1.2', flag: 'normal' },
      { name: 'ALT (SGPT)', value: 28, unit: 'U/L', referenceRange: '< 40', flag: 'normal' },
      { name: 'AST (SGOT)', value: 32, unit: 'U/L', referenceRange: '< 40', flag: 'normal' }
    ],
    notes: 'Chức năng gan và thận bình thường'
  },
  {
    id: '3',
    orderId: 'TO-2024-008',
    testType: 'Đông máu',
    testDate: '2024-12-18T14:00:00',
    completedDate: '2024-12-18T15:30:00',
    status: 'completed',
    doctor: 'BS. Nguyễn Văn D',
    parameters: [
      { name: 'PT (Prothrombin Time)', value: 12.5, unit: 'seconds', referenceRange: '11.0 - 13.0', flag: 'normal' },
      { name: 'INR', value: 1.1, unit: '', referenceRange: '0.8 - 1.2', flag: 'normal' },
      { name: 'aPTT', value: 28, unit: 'seconds', referenceRange: '25 - 35', flag: 'normal' },
      { name: 'Fibrinogen', value: 285, unit: 'mg/dL', referenceRange: '200 - 400', flag: 'normal' }
    ],
    notes: 'Chức năng đông máu bình thường'
  },
  {
    id: '4',
    orderId: 'TO-2024-025',
    testType: 'Sinh hóa máu',
    testDate: '2024-12-10T10:30:00',
    completedDate: '2024-12-10T12:45:00',
    status: 'completed',
    doctor: 'BS. Lê Thị C',
    parameters: [
      { name: 'Glucose (Đường huyết)', value: 145, unit: 'mg/dL', referenceRange: '70 - 110', flag: 'high' },
      { name: 'HbA1c', value: 7.2, unit: '%', referenceRange: '< 6.5', flag: 'high' },
      { name: 'Cholesterol tổng', value: 245, unit: 'mg/dL', referenceRange: '< 200', flag: 'high' },
      { name: 'Triglycerides', value: 185, unit: 'mg/dL', referenceRange: '< 150', flag: 'high' },
      { name: 'HDL-C', value: 35, unit: 'mg/dL', referenceRange: '> 40', flag: 'low' },
      { name: 'LDL-C', value: 155, unit: 'mg/dL', referenceRange: '< 130', flag: 'high' }
    ],
    notes: 'Cần kiểm soát đường huyết và lipid máu. Tái khám sau 3 tháng.'
  }
];

export function PatientResults() {
  const [testResults] = useState<PatientTestResult[]>(mockPatientResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<PatientTestResult | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTestType = testTypeFilter === 'all' || result.testType === testTypeFilter;
    
    return matchesSearch && matchesTestType;
  });

  const handleViewResult = (result: PatientTestResult) => {
    setSelectedResult(result);
    setIsDetailDialogOpen(true);
  };

  const getFlagIcon = (flag: string) => {
    switch (flag) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getFlagClass = (flag: string) => {
    switch (flag) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      case 'critical':
        return 'text-red-800 bg-red-100';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Chờ xử lý</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Đang xử lý</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownloadReport = (result: PatientTestResult) => {
    // Mock PDF download
    alert(`Tải xuống báo cáo: ${result.testType} - ${result.orderId}`);
  };

  const getAbnormalCount = (parameters: TestParameter[]) => {
    return parameters.filter(p => p.flag !== 'normal').length;
  };

  const testTypes = [...new Set(testResults.map(result => result.testType))];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Kết quả Xét nghiệm của tôi</h1>
          <p className="text-blue-600">Xem các kết quả xét nghiệm và báo cáo của bạn</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Tổng số xét nghiệm</p>
                  <p className="text-2xl text-blue-900">{testResults.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Kết quả bình thường</p>
                  <p className="text-2xl text-green-900">
                    {testResults.filter(r => getAbnormalCount(r.parameters) === 0).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Có bất thường</p>
                  <p className="text-2xl text-orange-900">
                    {testResults.filter(r => getAbnormalCount(r.parameters) > 0).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Danh sách Kết quả</CardTitle>
            <CardDescription>Các kết quả xét nghiệm của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex gap-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm kết quả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo loại XN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {testTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã xét nghiệm</TableHead>
                  <TableHead>Loại xét nghiệm</TableHead>
                  <TableHead>Ngày thực hiện</TableHead>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => {
                  const abnormalCount = getAbnormalCount(result.parameters);
                  return (
                    <TableRow key={result.id}>
                      <TableCell className="text-blue-700">{result.orderId}</TableCell>
                      <TableCell>{result.testType}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(result.testDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{result.doctor}</TableCell>
                      <TableCell>{getStatusBadge(result.status)}</TableCell>
                      <TableCell>
                        {result.status === 'completed' ? (
                          abnormalCount > 0 ? (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-600 text-sm">
                                {abnormalCount} bất thường
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 text-sm">Bình thường</span>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 text-sm">Chưa có kết quả</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewResult(result)}
                            disabled={result.status !== 'completed'}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(result)}
                            disabled={result.status !== 'completed'}
                          >
                            <Download className="w-4 h-4" />
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

        {/* Result Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Kết quả Xét nghiệm</DialogTitle>
              <DialogDescription>
                {selectedResult?.testType} - {selectedResult?.orderId}
              </DialogDescription>
            </DialogHeader>
            {selectedResult && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <label className="text-sm text-gray-600">Mã xét nghiệm</label>
                    <p className="text-blue-700">{selectedResult.orderId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Loại xét nghiệm</label>
                    <p>{selectedResult.testType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ngày thực hiện</label>
                    <p>{new Date(selectedResult.testDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Bác sĩ</label>
                    <p>{selectedResult.doctor}</p>
                  </div>
                </div>

                {/* Test Results */}
                <div>
                  <h4 className="text-blue-900 mb-3">Kết quả Chi tiết</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chỉ số</TableHead>
                        <TableHead>Kết quả</TableHead>
                        <TableHead>Đơn vị</TableHead>
                        <TableHead>Giá trị tham chiếu</TableHead>
                        <TableHead>Đánh giá</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedResult.parameters.map((param, index) => (
                        <TableRow key={index} className={getFlagClass(param.flag)}>
                          <TableCell>{param.name}</TableCell>
                          <TableCell className="font-medium">{param.value}</TableCell>
                          <TableCell>{param.unit}</TableCell>
                          <TableCell>{param.referenceRange}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {getFlagIcon(param.flag)}
                              <span className="text-sm capitalize">
                                {param.flag === 'normal' ? 'Bình thường' :
                                 param.flag === 'high' ? 'Cao' :
                                 param.flag === 'low' ? 'Thấp' : 'Nghiêm trọng'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Doctor's Notes */}
                {selectedResult.notes && (
                  <div className="border-t pt-4">
                    <h5 className="text-blue-900 mb-2">Nhận xét của Bác sĩ</h5>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm">{selectedResult.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleDownloadReport(selectedResult)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống PDF
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    In kết quả
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