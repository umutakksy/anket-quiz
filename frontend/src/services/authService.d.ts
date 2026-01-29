export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'HR_MANAGER';
export interface User {
    username: string;
    role: UserRole;
    department?: string;
    name: string;
    id?: string;
}
declare class AuthService {
    private currentUser;
    getCurrentUser(): User | null;
    getUserDepartment(): string | undefined;
    isAdmin(): boolean;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=authService.d.ts.map