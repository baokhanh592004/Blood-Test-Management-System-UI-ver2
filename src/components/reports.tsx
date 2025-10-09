import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  FlaskConical,
  Settings,
  Package,
  Eye,
  Plus
} from 'lucide-react';

type ReportType = 'test_results' | 'patient_summary' | 'instrument_usage' | 'reagent_consumption' | 
  'daily_summary' | 'monthly_summary' | 'quality_control' | 'user_activity';

type Report = {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  createdDate: string;
  createdBy: string;
  fileSize: string;
  status: 'generated' | 'generating' | 'failed';
  parameters?: {
    startDate?: string;
    endDate?: string;
    department?: string;
    testType?: string;
    patientId?: string;
  };
};

type ReportTemplate = {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  icon: React.ReactNode;
  frequency: 'on_demand' | 'daily' | 'weekly' | 'monthly';
  parameters: string[];
};

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Báo cáo Kết quả Xét nghiệm',
    type: 'test_results',
    description: 'Xuất danh sách kết quả xét nghiệm theo khoảng thời gian',
    icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
    frequency: 'on_demand',
    parameters: ['dateRange', 'testType', 'status']
  },
  {
    id: '2',
    name: 'Tổng hợp Bệnh nhân',
    type: 'patient_summary',
    description: 'Thống kê tổng quan về bệnh nhân và xét nghiệm',
    icon: <Users className="w-6 h-6 text-green-600" />,
    frequency: 'monthly',
    parameters: ['dateRange', 'department']
  },
  {
    id: '3',
    name: 'Sử dụng Thiết bị',
    type: 'instrument_usage',
    description: 'Thống kê tình hình sử dụng và hiệu suất thiết bị',
    icon: <Settings className="w-6 h-6 text-orange-600" />,
    frequency: 'weekly',
    parameters: ['dateRange', 'instrumentId']
  },
  {
    id: '4',
    name: 'Tiêu thụ Thuốc thử',
    type: 'reagent_consumption',
    description: 'Báo cáo tình hình tiêu thụ và tồn kho thuốc thử',
    icon: <Package className="w-6 h-6 text-purple-600" />,
    frequency: 'monthly',
    parameters: ['dateRange', 'category', 'supplier']
  },
  {
    id: '5',
    name: 'Tổng kết Ngày',
    type: 'daily_summary',
    description: 'Báo cáo tổng kết hoạt động trong ngày',
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    frequency: 'daily',
    parameters: ['date']
  },
  {
    id: '6',
    name: 'Thống kê Tháng',
    type: 'monthly_summary',
    description: 'Báo cáo thống kê tổng hợp trong tháng',
    icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    frequency: 'monthly',
    parameters: ['month', 'year']
  }
];

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Kết quả XN - Tháng 12/2024',
    type: 'test_results',
    description: 'Báo cáo tất cả kết quả xét nghiệm tháng 12',
    createdDate: '2024-12-25T10:30:00',
    createdBy: 'BS. Nguyễn Văn Manager',
    fileSize: '2.5 MB',
    status: 'generated',
    parameters: {
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      testType: 'all'
    }
  },
  {
    id: '2',
    name: 'Tổng hợp Bệnh nhân - Q4/2024',
    type: 'patient_summary',
    description: 'Thống kê bệnh nhân quý 4 năm 2024',
    createdDate: '2024-12-24T16:45:00',
    createdBy: 'Admin User',
    fileSize: '1.8 MB',
    status: 'generated',
    parameters: {
      startDate: '2024-10-01',
      endDate: '2024-12-31'
    }
  },
  {
    id: '3',
    name: 'Hiệu suất Thiết bị - Tuần 51',
    type: 'instrument_usage',
    description: 'Báo cáo hiệu suất sử dụng thiết bị tuần 51',
    createdDate: '2024-12-25T09:15:00',
    createdBy: 'KTV. Trần Thị Lan',
    fileSize: '950 KB',
    status: 'generating'
  },
  {
    id: '4',
    name: 'Tiêu thụ Thuốc thử - Tháng 12',
    type: 'reagent_consumption',
    description: 'Báo cáo tiêu thụ thuốc thử tháng 12/2024',
    createdDate: '2024-12-23T14:20:00',
    createdBy: 'BS. Nguyễn Văn Manager',
    fileSize: '1.2 MB',
    status: 'failed'
  }
];

export function Reports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const handleGenerateReport = (formData: FormData) => {
    if (!selectedTemplate) return;

    const newReport: Report = {
      id: (reports.length + 1).toString(),
      name: `${selectedTemplate.name} - ${new Date().toLocaleDateString('vi-VN')}`,
      type: selectedTemplate.type,
      description: `Báo cáo được tạo từ template: ${selectedTemplate.name}`,
      createdDate: new Date().toISOString(),
      createdBy: 'Current User',
      fileSize: '0 KB',
      status: 'generating',
      parameters: {
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        testType: formData.get('testType') as string,
        department: formData.get('department') as string
      }
    };

    setReports([newReport, ...reports]);
    setIsGenerateDialogOpen(false);
    setSelectedTemplate(null);

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'generated' as const, fileSize: '1.5 MB' }
          : report
      ));
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-700">Đang tạo</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getReportTypeLabel = (type: ReportType) => {
    const labels = {
      test_results: 'Kết quả XN',
      patient_summary: 'Tổng hợp BN',
      instrument_usage: 'Sử dụng TB',
      reagent_consumption: 'Tiêu thụ TT',
      daily_summary: 'Tổng kết Ngày',
      monthly_summary: 'Thống kê Tháng',
      quality_control: 'Kiểm soát CL',
      user_activity: 'Hoạt động ND'
    };
    return labels[type] || type;
  };

  const handleDownload = (reportId: string) => {
    // Mock download functionality
    const report = reports.find(r => r.id === reportId);
    if (report && report.status === 'generated') {
      // In a real app, this would trigger actual file download
      alert(`Tải xuống báo cáo: ${report.name}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Báo cáo</h1>
          <p className="text-blue-600">Tạo và quản lý các báo cáo hệ thống</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Báo cáo hôm nay</p>
                  <p className="text-xl text-blue-900">12</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Hoàn thành</p>
                  <p className="text-xl text-green-900">
                    {reports.filter(r => r.status === 'generated').length}
                  </p>
                </div>
                <Download className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Đang tạo</p>
                  <p className="text-xl text-yellow-900">
                    {reports.filter(r => r.status === 'generating').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Thất bại</p>
                  <p className="text-xl text-red-900">
                    {reports.filter(r => r.status === 'failed').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Templates */}
        <Card className="border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Mẫu Báo cáo</CardTitle>
            <CardDescription>Chọn mẫu báo cáo để tạo báo cáo mới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {template.icon}
                      <div className="flex-1">
                        <h4 className="text-blue-900 mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {template.frequency === 'on_demand' ? 'Theo yêu cầu' : 
                             template.frequency === 'daily' ? 'Hàng ngày' :
                             template.frequency === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
                          </Badge>
                          <Dialog open={isGenerateDialogOpen && selectedTemplate?.id === template.id} 
                                  onOpenChange={(open) => {
                                    setIsGenerateDialogOpen(open);
                                    if (!open) setSelectedTemplate(null);
                                  }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                onClick={() => setSelectedTemplate(template)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Tạo
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Tạo báo cáo: {template.name}</DialogTitle>
                                <DialogDescription>
                                  Cấu hình tham số cho báo cáo
                                </DialogDescription>
                              </DialogHeader>
                              <form action={handleGenerateReport} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="startDate">Từ ngày</Label>
                                    <Input id="startDate" name="startDate" type="date" required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="endDate">Đến ngày</Label>
                                    <Input id="endDate" name="endDate" type="date" required />
                                  </div>
                                </div>

                                {template.parameters.includes('testType') && (
                                  <div className="space-y-2">
                                    <Label htmlFor="testType">Loại xét nghiệm</Label>
                                    <Select name="testType">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại xét nghiệm" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="hematology">Công thức máu</SelectItem>
                                        <SelectItem value="chemistry">Sinh hóa máu</SelectItem>
                                        <SelectItem value="coagulation">Đông máu</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {template.parameters.includes('department') && (
                                  <div className="space-y-2">
                                    <Label htmlFor="department">Phòng ban</Label>
                                    <Select name="department">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn phòng ban" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="hematology">Hematology</SelectItem>
                                        <SelectItem value="chemistry">Chemistry</SelectItem>
                                        <SelectItem value="microbiology">Microbiology</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <div className="flex justify-end space-x-2 pt-4">
                                  <Button type="button" variant="outline" 
                                          onClick={() => setIsGenerateDialogOpen(false)}>
                                    Hủy
                                  </Button>
                                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Tạo báo cáo
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated Reports */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Báo cáo đã tạo</CardTitle>
            <CardDescription>Danh sách các báo cáo đã được tạo</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên báo cáo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Người tạo</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p>{report.name}</p>
                        <p className="text-xs text-gray-500">{report.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getReportTypeLabel(report.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(report.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{report.createdBy}</TableCell>
                    <TableCell>{report.fileSize}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(report.id)}
                          disabled={report.status !== 'generated'}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}