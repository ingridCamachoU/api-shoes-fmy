class UseCasesSizes {
    constructor(repositorySize) {
        this.repositorySize = repositorySize;
    }

    async getSizesUseCase() {
        const [sizes] = await this.repositorySize.getAllSizeRepository();
        if (sizes) return { message: sizes, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createSizeUseCase(payload) {
        const [, error] = await this.repositorySize.createSizeRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateSizesUseCase(payload, id) {
        const [data, error, code] = await this.repositorySize.updateSizeRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteSizeUseCase(id) {
        const size = await this.repositorySize.deleteSizeRepository(id);
        if (size) return { message: size, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getSizeUseCase(id) {
        return this.repositorySize.getSizeRepository(id);
    }
}

module.exports = UseCasesSizes;
