export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'HR_MANAGER';

export interface User {
    username: string;
    role: UserRole;
    department?: string;
    name: string;
    id?: string;
}

class AuthService {
    private currentUser: User | null = null;
    private readonly AUTH_KEY = 'auth_user';

    constructor() {
        const savedUser = localStorage.getItem(this.AUTH_KEY);
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            } catch (e) {
                localStorage.removeItem(this.AUTH_KEY);
            }
        }
    }

    async login(username: string, password: string): Promise<boolean> {
        // Hardcoded admin login for now as requested
        if (username === 'admin' && password === 'ismer123') {
            this.currentUser = {
                username: 'admin',
                role: 'ADMIN',
                name: 'Sistem Yöneticisi',
                department: 'Yazılım'
            };
            localStorage.setItem(this.AUTH_KEY, JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.AUTH_KEY);
        window.location.href = '/login';
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

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
