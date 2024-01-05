class UseCasesOrder {
    constructor(repositoryOrder) {
        this.repositoryOrder = repositoryOrder;
    }

    async getOrdersUseCase() {
        const [orders] = await this.repositoryOrder.getAllOrdersRepository();
        if (orders) return { message: orders, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async getDetailOrderUseCase(id) {
        // eslint-disable-next-line max-len
        const [data, error, code] = await this.repositoryOrder.getDetailOrderRepository(id);
        if (!error) return { code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async createOrderUseCase(payload) {
        console.log('result:', payload);
        console.log('Result:', JSON.stringify(payload));
        const [, error] = await this.repositoryOrder.createOrderRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateOrderUseCase(payload, id) {
        const [data, error, code] = await this.repositoryOrder.updateOrderRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteOrderUseCase(id) {
        const order = await this.repositoryOrder.deleteOrderRepository(id);
        if (order) return { message: order, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getOrderUseCase(id) {
        return this.repositoryOrder.getOrderRepository(id);
    }
}

module.exports = UseCasesOrder;
