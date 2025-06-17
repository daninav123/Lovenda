// Tipos de usuarios
export type UserRole = 'spouse' | 'helper' | 'planner' | 'guest';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  weddingId?: string; // ID de la boda a la que está asociado
}

// Tipos de tareas
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'inProgress' | 'completed' | 'blocked';
export type TaskType = 'general' | 'bouquet' | 'surprise' | 'vendor' | 'protocol';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  assignedTo: string[]; // IDs de usuarios
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
  // Campos específicos para tareas de ramo/sorpresa
  recipient?: string;
  tableNumber?: string;
  outfitDetails?: string;
}

// Tipos de invitados
export type GuestStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: GuestStatus;
  plusOnes: number;
  tableNumber?: string;
  dietaryRestrictions?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de proveedores
export type VendorType = 'catering' | 'photography' | 'music' | 'venue' | 'florist' | 'other';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  contractSigned: boolean;
  contractUrl?: string;
  price: number;
  depositPaid: number;
  paymentDueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para el protocolo
export interface ProtocolItem {
  id: string;
  title: string;
  description: string;
  time: Date;
  duration: number; // en minutos
  location?: string;
  responsiblePerson?: string;
  notes?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para el presupuesto
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  notes?: string;
}

export interface BudgetItem {
  id: string;
  categoryId: string;
  name: string;
  estimatedCost: number;
  actualCost?: number;
  paid: boolean;
  dueDate?: Date;
  vendorId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para la boda
export interface Wedding {
  id: string;
  partner1: string;
  partner2: string;
  date: Date;
  location: string;
  budget: number;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
