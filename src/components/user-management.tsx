import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Plus, Edit, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../App';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdDate: string;
  department?: string;
  phone?: string;
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@lab.com',
    role: 'administrator',
    status: 'active',
    lastLogin: '2024-12-25T08:30:00',
    createdDate: '2024-01-15T00:00:00',
    department: 'IT',
    phone: '0901111111'
  },
  {
    id: '2',
    name: 'Dr. Nguyễn Văn Manager',
    email: 'manager@lab.com',
    role: 'lab_manager',
    status: 'active',
    lastLogin: '2024-12-25T07:45:00',
    createdDate: '2024-02-01T00:00:00',
    department: 'Laboratory',
    phone: '0902222222'
  },
  {
    id: '3',
    name: 'KTV. Trần Thị Lan',
    email: 'tech1@lab.com',
    role: 'lab_user',
    status: 'active',
    lastLogin: '2024-12-25T09:15:00',
    createdDate: '2024-03-10T00:00:00',
    department: 'Hematology',
    phone: '0903333333'
  },
  {
    id: '4',
    name: 'KTV. Lê Văn Minh',
    email: 'tech2@lab.com',
    role: 'lab_user',
    status: 'active',
    lastLogin: '2024-12-24T16:30:00',
    createdDate: '2024-04-05T00:00:00',
    department: 'Chemistry',
    phone: '0904444444'
  },
  {
    id: '5',
    name: 'Service Engineer',
    email: 'service@lab.com',
    role: 'service_user',
    status: 'inactive',
    lastLogin: '2024-12-20T14:20:00',
    createdDate: '2024-05-01T00:00:00',
    department: 'Maintenance',
    phone: '0905555555'
  }
];

const roleLabels = {
  administrator: 'Administrator',
  lab_manager: 'Lab Manager',
  lab_user: 'Lab User',
  service_user: 'Service User',
  patient: 'Patient'
};

const departments = [
  'Laboratory',
  'Hematology',
  'Chemistry',
  'Microbiology',
  'Immunology',
  'IT',
  'Maintenance',
  'Administration'
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (formData: FormData) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      status: 'active',
      createdDate: new Date().toISOString(),
      department: formData.get('department') as string,
      phone: formData.get('phone') as string
    };
    
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (formData: FormData) => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as UserRole,
          status: formData.get('status') as 'active' | 'inactive',
          department: formData.get('department') as string,
          phone: formData.get('phone') as string
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' as const : 'active' as const
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
      : <Badge variant="secondary" className="bg-gray-100 text-gray-700">Không hoạt động</Badge>;
  };

  const getRoleBadge = (role: UserRole) => {
    const colors = {
      administrator: 'bg-red-100 text-red-700',
      lab_manager: 'bg-purple-100 text-purple-700',
      lab_user: 'bg-blue-100 text-blue-700',
      service_user: 'bg-orange-100 text-orange-700',
      patient: 'bg-gray-100 text-gray-700'
    };

    return (
      <Badge variant="secondary" className={colors[role]}>
        {roleLabels[role]}
      </Badge>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-blue-900 mb-2">Quản lý Người dùng</h1>
          <p className="text-blue-600">Quản lý tài khoản và phân quyền người dùng hệ thống</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-900">Danh sách Người dùng</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm người dùng
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thêm người dùng mới</DialogTitle>
                    <DialogDescription>
                      Tạo tài khoản mới cho hệ thống
                    </DialogDescription>
                  </DialogHeader>
                  <form action={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" name="name" placeholder="Nhập họ tên" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Nhập email" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select name="role" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrator">Administrator</SelectItem>
                            <SelectItem value="lab_manager">Lab Manager</SelectItem>
                            <SelectItem value="lab_user">Lab User</SelectItem>
                            <SelectItem value="service_user">Service User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Phòng ban</Label>
                        <Select name="department" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" name="phone" placeholder="Nhập số điện thoại" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu tạm thời</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Tạo tài khoản
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
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="lab_manager">Lab Manager</SelectItem>
                  <SelectItem value="lab_user">Lab User</SelectItem>
                  <SelectItem value="service_user">Service User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <span className="text-xs">
                          {new Date(user.lastLogin).toLocaleString('vi-VN')}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Chưa đăng nhập</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className={user.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin tài khoản
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <form action={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Họ và tên</Label>
                    <Input 
                      id="edit-name" 
                      name="name" 
                      defaultValue={selectedUser.name}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input 
                      id="edit-email" 
                      name="email" 
                      type="email" 
                      defaultValue={selectedUser.email}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Vai trò</Label>
                    <Select name="role" defaultValue={selectedUser.role} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="lab_manager">Lab Manager</SelectItem>
                        <SelectItem value="lab_user">Lab User</SelectItem>
                        <SelectItem value="service_user">Service User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Trạng thái</Label>
                    <Select name="status" defaultValue={selectedUser.status} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Phòng ban</Label>
                    <Select name="department" defaultValue={selectedUser.department} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Số điện thoại</Label>
                    <Input 
                      id="edit-phone" 
                      name="phone" 
                      defaultValue={selectedUser.phone}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Cập nhật
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}