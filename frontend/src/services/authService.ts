export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'HR_MANAGER';

export interface User {
    username: string;
    role: UserRole;
    department?: string;
    name: string;
    id?: string;
}

class AuthService {
    private currentUser: User | null = {
        username: 'admin',
        role: 'ADMIN',
        name: 'Sistem Yöneticisi',
        department: 'Yazılım'
    };

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    getUserDepartment(): string | undefined {
        return this.currentUser?.department;
    }

    isAdmin(): boolean {
        return this.currentUser?.role === 'ADMIN';
    }
}

export const authService = new AuthService();
