class UseCasesUser {
    constructor(repositoryUser) {
        this.repositoryUser = repositoryUser;
    }

    async getUsersUseCase() {
        const [users] = await this.repositoryUser.getAllUserRepository();
        if (users) return { message: users, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createUserUseCase(payload) {
        const [, error] = await this.repositoryUser.createUserRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async loginUserUseCase(payload) {
        const [users, error] = await this.repositoryUser.loginUserRepository(payload);
        if (!error) return { message: users, code: 201 };
        return { message: users, code: 409 };
    }

    async updateUserUseCase(payload, id) {
        const [data, error, code] = await this.repositoryUser.updateUserRepository(payload, id);
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteUserUseCase(id) {
        const user = await this.repositoryUser.deleteUserRepository(id);
        if (user) return { message: user, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getUserUseCase(id) {
        return this.repositoryUser.getUserRepository(id);
    }

    getUserByEmailUseCase(email) {
        return this.repositoryUser.getUserByEmailRepository(email);
    }
}

module.exports = UseCasesUser;
