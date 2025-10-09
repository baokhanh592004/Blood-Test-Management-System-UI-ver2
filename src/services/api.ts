// Mock API service layer that mimics database operations
import { 
  Patient, 
  TestOrder, 
  ProcessedResult, 
  User, 
  Instrument, 
  Reagent, 
  ReagentInventory,
  EventLog,
  OrderStatus,
  InstrumentMode,
  PatientWithTestOrders,
  TestOrderWithDetails,
  ProcessedResultWithDetails,
  InstrumentWithHistory,
  ReagentWithInventory,
  ApiResponse,
  PaginationParams,
  AppUser
} from '../types/database';

// Mock data that follows the database schema
const mockPatients: PatientWithTestOrders[] = [
  {
    id: '1',
    patient_code: 'P001',
    full_name: 'Nguyễn Văn An',
    dob: '1985-03-15',
    gender: 'male',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    created_at: '2024-01-15T00:00:00Z',
    test_orders: []
  },
  {
    id: '2',
    patient_code: 'P002',
    full_name: 'Trần Thị Bình',
    dob: '1990-07-22',
    gender: 'female',
    phone: '0907654321',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    created_at: '2024-02-01T00:00:00Z',
    test_orders: []
  }
];

const mockTestOrders: TestOrderWithDetails[] = [
  {
    id: '1',
    patient_id: '1',
    barcode: '240001001',
    status: 'Completed',
    created_by: 'user1',
    created_at: '2024-12-25T08:30:00Z',
    run_by: 'user2',
    run_at: '2024-12-25T10:15:00Z',
    instrument_id: 'inst1'
  },
  {
    id: '2',
    patient_id: '2',
    barcode: '240001002',
    status: 'Processing',
    created_by: 'user1',
    created_at: '2024-12-25T09:00:00Z',
    instrument_id: 'inst2'
  }
];

const mockInstruments: InstrumentWithHistory[] = [
  {
    id: 'inst1',
    name: 'Hematology Analyzer A',
    model: 'HA-8000',
    serial_no: 'HA001234',
    mode: 'Ready',
    active: true,
    activated_at: '2024-01-01T00:00:00Z',
    config: { max_samples: 100, auto_mode: true },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'inst2',
    name: 'Chemistry Analyzer B',
    model: 'CA-5000',
    serial_no: 'CA005678',
    mode: 'Processing',
    active: true,
    activated_at: '2024-01-01T00:00:00Z',
    config: { max_samples: 200, auto_mode: true },
    created_at: '2024-01-01T00:00:00Z'
  }
];

const mockReagents: ReagentWithInventory[] = [
  {
    id: 'reagent1',
    name: 'Hemoglobin Reagent',
    catalog_no: 'HGB-001',
    manufacturer: 'BioTech Corp',
    unit: 'mL',
    inventory: [
      {
        id: 'inv1',
        reagent_id: 'reagent1',
        lot_no: 'LOT2024001',
        expiry_date: '2025-06-30',
        quantity: 150,
        location: 'Fridge A1',
        created_at: '2024-01-15T00:00:00Z'
      }
    ],
    total_quantity: 150,
    low_stock_items: 0,
    expired_items: 0
  }
];

const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'admin@lab.com',
    full_name: 'Admin User',
    phone: '0901111111',
    is_active: true,
    password_hash: 'hashed_password',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// API Service Class
export class ApiService {
  // Patients API
  static async getPatients(params?: PaginationParams): Promise<ApiResponse<PatientWithTestOrders[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredPatients = [...mockPatients];
    
    if (params?.search) {
      filteredPatients = filteredPatients.filter(p => 
        p.full_name.toLowerCase().includes(params.search!.toLowerCase()) ||
        p.patient_code?.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredPatients.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: filteredPatients.length,
        total_pages: Math.ceil(filteredPatients.length / limit)
      }
    };
  }

  static async getPatientById(id: string): Promise<ApiResponse<PatientWithTestOrders>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const patient = mockPatients.find(p => p.id === id);
    if (!patient) {
      return { error: 'Patient not found' };
    }
    
    return { data: patient };
  }

  static async createPatient(patientData: Partial<Patient>): Promise<ApiResponse<Patient>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPatient: Patient = {
      id: `patient_${Date.now()}`,
      patient_code: `P${String(mockPatients.length + 1).padStart(3, '0')}`,
      full_name: patientData.full_name || '',
      dob: patientData.dob,
      gender: patientData.gender,
      phone: patientData.phone,
      address: patientData.address,
      created_at: new Date().toISOString()
    };
    
    mockPatients.push(newPatient);
    return { data: newPatient, message: 'Patient created successfully' };
  }

  // Test Orders API
  static async getTestOrders(params?: PaginationParams): Promise<ApiResponse<TestOrderWithDetails[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredOrders = [...mockTestOrders];
    
    if (params?.search) {
      filteredOrders = filteredOrders.filter(o => 
        o.barcode?.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params?.filters?.status) {
      filteredOrders = filteredOrders.filter(o => o.status === params.filters!.status);
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredOrders.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        total_pages: Math.ceil(filteredOrders.length / limit)
      }
    };
  }

  static async createTestOrder(orderData: Partial<TestOrder>): Promise<ApiResponse<TestOrder>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOrder: TestOrder = {
      id: `order_${Date.now()}`,
      patient_id: orderData.patient_id || '',
      barcode: `${Date.now().toString().slice(-9)}`,
      status: 'Pending',
      created_by: orderData.created_by || 'current_user',
      created_at: new Date().toISOString()
    };
    
    mockTestOrders.push(newOrder);
    return { data: newOrder, message: 'Test order created successfully' };
  }

  // Instruments API
  static async getInstruments(): Promise<ApiResponse<InstrumentWithHistory[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockInstruments };
  }

  static async updateInstrumentStatus(
    id: string, 
    mode: InstrumentMode, 
    reason?: string
  ): Promise<ApiResponse<Instrument>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const instrument = mockInstruments.find(i => i.id === id);
    if (!instrument) {
      return { error: 'Instrument not found' };
    }
    
    const prevMode = instrument.mode;
    instrument.mode = mode;
    
    // Add to status history (mock)
    if (!instrument.status_history) {
      instrument.status_history = [];
    }
    
    instrument.status_history.push({
      id: `history_${Date.now()}`,
      instrument_id: id,
      prev_mode: prevMode,
      new_mode: mode,
      reason: reason,
      changed_by: 'current_user',
      changed_at: new Date().toISOString()
    });
    
    return { data: instrument, message: 'Instrument status updated' };
  }

  // Reagents API
  static async getReagents(): Promise<ApiResponse<ReagentWithInventory[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockReagents };
  }

  static async updateReagentInventory(
    reagentId: string, 
    inventoryData: Partial<ReagentInventory>
  ): Promise<ApiResponse<ReagentInventory>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const reagent = mockReagents.find(r => r.id === reagentId);
    if (!reagent) {
      return { error: 'Reagent not found' };
    }
    
    const newInventory: ReagentInventory = {
      id: `inv_${Date.now()}`,
      reagent_id: reagentId,
      lot_no: inventoryData.lot_no,
      expiry_date: inventoryData.expiry_date,
      quantity: inventoryData.quantity || 0,
      location: inventoryData.location,
      created_at: new Date().toISOString()
    };
    
    if (!reagent.inventory) {
      reagent.inventory = [];
    }
    reagent.inventory.push(newInventory);
    
    // Recalculate totals
    reagent.total_quantity = reagent.inventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
    
    return { data: newInventory, message: 'Reagent inventory updated' };
  }

  // Users API
  static async getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredUsers = [...mockUsers];
    
    if (params?.search) {
      filteredUsers = filteredUsers.filter(u => 
        u.full_name.toLowerCase().includes(params.search!.toLowerCase()) ||
        u.email.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredUsers.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        total_pages: Math.ceil(filteredUsers.length / limit)
      }
    };
  }

  // Event Logs API
  static async getEventLogs(params?: PaginationParams): Promise<ApiResponse<EventLog[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockEventLogs: EventLog[] = [
      {
        id: '1',
        event_code: 'TEST_COMPLETED',
        message: { test_order_id: '1', patient_id: '1' },
        operator_id: 'user1',
        created_at: '2024-12-25T10:30:15Z'
      },
      {
        id: '2',
        event_code: 'USER_LOGIN',
        message: { user_id: 'user1', ip_address: '192.168.1.105' },
        operator_id: 'user1',
        created_at: '2024-12-25T10:15:32Z'
      }
    ];
    
    return { data: mockEventLogs };
  }

  // Authentication API
  static async authenticate(email: string, password: string): Promise<ApiResponse<AppUser>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication logic
    if (email && password) {
      const mockUser: AppUser = {
        id: 'user1',
        full_name: 'Test User',
        email: email,
        role: 'lab_user',
        permissions: ['view_patients', 'create_test_orders', 'view_results']
      };
      
      return { data: mockUser, message: 'Authentication successful' };
    }
    
    return { error: 'Invalid credentials' };
  }

  // Dashboard Stats API
  static async getDashboardStats(): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      data: {
        total_patients: mockPatients.length,
        total_test_orders: mockTestOrders.length,
        pending_results: mockTestOrders.filter(o => o.status === 'Pending').length,
        active_instruments: mockInstruments.filter(i => i.active).length,
        today_tests: 45,
        completion_rate: 94.5
      }
    };
  }
}

export default ApiService;