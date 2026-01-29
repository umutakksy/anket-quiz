class AuthService {
    currentUser = {
        username: 'admin',
        role: 'ADMIN',
        name: 'Sistem Yöneticisi',
        department: 'Yazılım'
    };
    getCurrentUser() {
        return this.currentUser;
    }
    getUserDepartment() {
        return this.currentUser?.department;
    }
    isAdmin() {
        return this.currentUser?.role === 'ADMIN';
    }
}
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map