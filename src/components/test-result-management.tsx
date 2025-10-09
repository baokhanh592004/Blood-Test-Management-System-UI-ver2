import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Eye, FileText, MessageSquare, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

type TestResult = {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testType: string;
  status: 'pending_review' | 'reviewed' | 'released';
  completedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  parameters: TestParameter[];
  comments?: string;
};

type TestParameter = {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'high' | 'low' | 'critical';
};

const mockTestResults: TestResult[] = [
  {
    id: '1',
    orderId: 'TO-2024-001',
    patientId: 'P001',
    patientName: 'Nguyễn Văn An',
    testType: 'Công thức máu',
    status: 'reviewed',
    completedDate: '2024-12-25T10:15:00',
    reviewedBy: 'BS. Trần Văn B',
    reviewDate: '2024-12-25T10:30:00',
    parameters: [
      { name: 'WBC', value: 8.2, unit: '10³/μL', referenceRange: '4.0 - 10.0', flag: 'normal' },
      { name: 'RBC', value: 4.8, unit: '10⁶/μL', referenceRange: '4.5 - 5.5', flag: 'normal' },
      { name: 'Hemoglobin', value: 15.2, unit: 'g/dL', referenceRange: '13.0 - 16.0', flag: 'normal' },
      { name: 'Hematocrit', value: 45.8, unit: '%', referenceRange: '40.0 - 50.0', flag: 'normal' },
      { name: 'Platelet', value: 320, unit: '10³/μL', referenceRange: '150 - 400', flag: 'normal' }
    ]
  },
  {
    id: '2',
    orderId: 'TO-2024-002',
    patientId: 'P002',
    patientName: 'Trần Thị Bình',
    testType: 'Sinh hóa máu',
    status: 'pending_review',
    completedDate: '2024-12-25T11:45:00',
    parameters: [
      { name: 'Glucose', value: 145, unit: 'mg/dL', referenceRange: '70 - 110', flag: 'high' },
      { name: 'Cholesterol', value: 185, unit: 'mg/dL', referenceRange: '< 200', flag: 'normal' },
      { name: 'Triglycerides', value: 95, unit: 'mg/dL', referenceRange: '< 150', flag: 'normal' },
      { name: 'Creatinine', value: 0.9, unit: 'mg/dL', referenceRange: '0.6 - 1.2', flag: 'normal' },
      { name: 'ALT', value: 45, unit: 'U/L', referenceRange: '< 40', flag: 'high' }
    ]
  },
  {
    id: '3',
    orderId: 'TO-2024-003',
    patientId: 'P003',
    patientName: 'Lê Văn Cường',
    testType: 'Đông máu',
    status: 'pending_review',
    completedDate: '2024-12-25T12:30:00',
    parameters: [
      { name: 'PT', value: 12.5, unit: 'seconds', referenceRange: '11.0 - 13.0', flag: 'normal' },
      { name: 'INR', value: 1.1, unit: '', referenceRange: '0.8 - 1.2', flag: 'normal' },
      { name: 'aPTT', value: 28, unit: 'seconds', referenceRange: '25 - 35', flag: 'normal' }
    ]
  }
];

export function TestResultManagement() {
  const [testResults, setTestResults] = useState<TestResult[]>(mockTestResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewResult = (result: TestResult) => {
    setSelectedResult(result);
    setReviewComment(result.comments || '');
    setIsViewDialogOpen(true);
  };

  const handleReviewResult = () => {
    if (!selectedResult) return;

    const updatedResults = testResults.map(result => {
      if (result.id === selectedResult.id) {
        return {
          ...result,
          status: 'reviewed' as const,
          reviewedBy: 'Current User',
          reviewDate: new Date().toISOString(),
          comments: reviewComment
        };
      }
      return result;
    });

    setTestResults(updatedResults);
    setIsViewDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Chờ đánh giá</Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Đã đánh giá</Badge>;
      case 'released':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Đã phát hành</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Quản lý Kết quả Xét nghiệm</h1>
          <p className="text-blue-600">Đánh giá và phát hành kết quả xét nghiệm</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Danh sách Kết quả</CardTitle>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending_review">Chờ đánh giá</SelectItem>
                  <SelectItem value="reviewed">Đã đánh giá</SelectItem>
                  <SelectItem value="released">Đã phát hành</SelectItem>
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
                  <TableHead>Ngày hoàn thành</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Người đánh giá</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="text-blue-700">{result.orderId}</TableCell>
                    <TableCell>
                      <div>
                        <p>{result.patientName}</p>
                        <p className="text-xs text-gray-500">{result.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{result.testType}</TableCell>
                    <TableCell>
                      {new Date(result.completedDate).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>
                      {result.reviewedBy ? (
                        <div>
                          <p className="text-sm">{result.reviewedBy}</p>
                          <p className="text-xs text-gray-500">
                            {result.reviewDate && new Date(result.reviewDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Chưa đánh giá</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResult(result)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Result Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Kết quả Xét nghiệm</DialogTitle>
              <DialogDescription>
                {selectedResult?.orderId} - {selectedResult?.patientName}
              </DialogDescription>
            </DialogHeader>
            {selectedResult && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <Label>Mã lệnh</Label>
                    <p className="text-blue-700">{selectedResult.orderId}</p>
                  </div>
                  <div>
                    <Label>Bệnh nhân</Label>
                    <p>{selectedResult.patientName} ({selectedResult.patientId})</p>
                  </div>
                  <div>
                    <Label>Loại xét nghiệm</Label>
                    <p>{selectedResult.testType}</p>
                  </div>
                  <div>
                    <Label>Ngày hoàn thành</Label>
                    <p>{new Date(selectedResult.completedDate).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {/* Test Parameters */}
                <div>
                  <h4 className="text-blue-900 mb-3">Kết quả Xét nghiệm</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thông số</TableHead>
                        <TableHead>Kết quả</TableHead>
                        <TableHead>Đơn vị</TableHead>
                        <TableHead>Khoảng tham chiếu</TableHead>
                        <TableHead>Cờ</TableHead>
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
                              <span className="text-xs capitalize">{param.flag}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Review Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h4 className="text-blue-900">Đánh giá và Nhận xét</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="comment">Nhận xét</Label>
                      <Textarea
                        id="comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Nhập nhận xét về kết quả xét nghiệm..."
                        rows={3}
                      />
                    </div>
                    
                    {selectedResult.status !== 'reviewed' && (
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleReviewResult}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Xác nhận đánh giá
                        </Button>
                        <Button variant="outline">
                          Yêu cầu xét nghiệm lại
                        </Button>
                      </div>
                    )}
                    
                    {selectedResult.status === 'reviewed' && (
                      <div className="flex space-x-2">
                        <Button className="bg-green-600 hover:bg-green-700">
                          Phát hành kết quả
                        </Button>
                        <Button variant="outline">
                          In báo cáo
                        </Button>
                        <Button variant="outline">
                          Gửi email cho bệnh nhân
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review History */}
                {selectedResult.reviewedBy && (
                  <div className="border-t pt-4">
                    <h5 className="text-sm text-blue-900 mb-2">Lịch sử đánh giá</h5>
                    <div className="text-sm text-gray-600">
                      <p>Đánh giá bởi: {selectedResult.reviewedBy}</p>
                      <p>Thời gian: {selectedResult.reviewDate && new Date(selectedResult.reviewDate).toLocaleString('vi-VN')}</p>
                      {selectedResult.comments && (
                        <p>Nhận xét: {selectedResult.comments}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}