class UseCasesProduct {
    constructor(repositoryProduct) {
        this.repositoryProduct = repositoryProduct;
    }

    async getProductsUseCase(query) {
        const [products] = await this.repositoryProduct.getAllProductRepository(query);
        if (products) return { message: products, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createProductUseCase(payload) {
        const [, error] = await this.repositoryProduct.createProductRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateProductUseCase(payload, id) {
        const [data, error, code] = await this.repositoryProduct.updateProductRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteProductUseCase(id) {
        const { data, statusCode } = await this.repositoryProduct.deleteProductRepository(id);
        return { code: statusCode, data };
    }

    async getOneProductUseCase(id) {
        const [data, error, code] = await this.repositoryProduct.getOneProductRepository(id);
        if (!error) return { code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async getProductUseCase(id) {
        return this.repositoryProduct.getProductRepository(id);
    }

    async searchProductUseCase(payload) {
        return this.repositoryProduct.searchProductRepository(payload);
    }
}

module.exports = UseCasesProduct;
