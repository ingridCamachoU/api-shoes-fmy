class UseCasesCategory {
    constructor(repositoryCategory) {
        this.repositoryCategory = repositoryCategory;
    }

    async getCategoriesUseCase() {
        const [categories] = await this.repositoryCategory.getAllCategoryRepository();
        if (categories) return { message: categories, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createCategoryUseCase(payload) {
        const [, error] = await this.repositoryCategory.createCategoryRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateCategoryUseCase(payload, id) {
        const [data, error, code] = await this.repositoryCategory.updateCategoryRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deletecategoryUseCase(id) {
        const category = await this.repositoryCategory.deleteCategoryRepository(id);
        if (category) return { message: category, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getCategoryUseCase(id) {
        return this.repositoryCategory.getCategoryRepository(id);
    }
}

module.exports = UseCasesCategory;
