import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TestTube, Lock, Mail, User, Crown, Wrench, UserCheck, Users } from 'lucide-react';
import { useAppContext, UserRole } from '../App';
import { AppUser } from '../types/database';

const demoAccounts = [
  {
    role: 'administrator' as UserRole,
    name: 'Admin User',
    email: 'admin@lab.com',
    password: 'admin123',
    icon: Crown,
    description: 'Quản lý toàn bộ hệ thống'
  },
  {
    role: 'lab_manager' as UserRole,
    name: 'BS. Nguyễn Văn Manager',
    email: 'manager@lab.com',
    password: 'manager123',
    icon: UserCheck,
    description: 'Quản lý phòng thí nghiệm'
  },
  {
    role: 'lab_user' as UserRole,
    name: 'KTV. Trần Thị Lan',
    email: 'tech@lab.com',
    password: 'tech123',
    icon: User,
    description: 'Kỹ thuật viên xét nghiệm'
  },
  {
    role: 'service_user' as UserRole,
    name: 'Service Engineer',
    email: 'service@lab.com',
    password: 'service123',
    icon: Wrench,
    description: 'Bảo trì hệ thống'
  },
  {
    role: 'patient' as UserRole,
    name: 'Nguyễn Văn A',
    email: 'patient@email.com',
    password: 'patient123',
    icon: Users,
    description: 'Bệnh nhân'
  }
];

export function LoginPage() {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('lab_user');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find demo account based on selected role
    const selectedAccount = demoAccounts.find(account => account.role === selectedRole);
    
    if (selectedAccount) {
      setUser({
        id: selectedAccount.role,
        full_name: selectedAccount.name,
        email: selectedAccount.email,
        role: selectedAccount.role
      });
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account.role);
    
    setUser({
      id: account.role,
      full_name: account.name,
      email: account.email,
      role: account.role
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <TestTube className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl text-blue-900 mb-2">Hệ thống Quản lý Xét nghiệm Máu</h1>
          <p className="text-blue-700">Phòng thí nghiệm Lâm sàng</p>
        </div>

        {!showDemoAccounts ? (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-blue-900">Đăng nhập Demo</CardTitle>
              <CardDescription>Chọn vai trò hoặc sử dụng tài khoản demo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="lab_manager">Laboratory Manager</SelectItem>
                      <SelectItem value="lab_user">Lab User (Technician)</SelectItem>
                      <SelectItem value="service_user">Service User</SelectItem>
                      <SelectItem value="patient">Normal User (Patient)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email (bất kỳ)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu (bất kỳ)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Đăng nhập
                </Button>

                <div className="text-center">
                  <Button 
                    type="button"
                    variant="link" 
                    className="text-blue-600"
                    onClick={() => setShowDemoAccounts(true)}
                  >
                    Xem tài khoản demo có sẵn
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-blue-900">Tài khoản Demo</CardTitle>
              <CardDescription>Chọn một tài khoản để đăng nhập ngay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoAccounts.map((account) => {
                  const IconComponent = account.icon;
                  return (
                    <Button
                      key={account.role}
                      variant="outline"
                      className="w-full p-4 h-auto flex items-start space-x-3 hover:bg-blue-50"
                      onClick={() => handleDemoLogin(account)}
                    >
                      <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-left flex-1">
                        <div className="font-medium text-blue-900">{account.name}</div>
                        <div className="text-sm text-gray-600">{account.email}</div>
                        <div className="text-xs text-gray-500">{account.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="text-blue-600"
                  onClick={() => setShowDemoAccounts(false)}
                >
                  Quay lại form đăng nhập
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-900 mb-2">🔑 Hướng dẫn Demo</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Cách 1:</strong> Chọn vai trò và nhập email/mật khẩu bất kỳ</p>
              <p>• <strong>Cách 2:</strong> Chọn tài khoản demo có sẵn để đăng nhập ngay</p>
              <p>• Đây là hệ thống demo, không cần tài khoản thực</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}