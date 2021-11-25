const fs = require('fs');

class Container {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async getAll() {
        try {
            const products = await fs.promises.readFile(this.archivo, "utf-8");
            return JSON.parse(products);
        } catch (error) {
            return [];
        }
    }

    async save(product) {
        const products = await this.getAll();
        let newId;
        if (products.length === 0) {
            newId = 1;
            console.log(newId);
        } else {
            newId = products[products.length - 1].id + 1;
            console.log("El Id asignado es:", newId);
        }

        const newProduct = {
            ...product,
            id: newId
        };
        products.push(newProduct);

        try {
            await fs.promises.writeFile(
                this.archivo,
                JSON.stringify(products, null, 2),
                "utf-8"
            );
            return newId;
        } catch (error) {
            throw new Error(`Error en fs.writeFile:${error}`);
        }
    }

    async getById(num) {
        try {
            const data = await this.getAll();
            const product = data.find(item => item.id == num);
            return product;

        } catch (error) {
            console.log("Error metodo getById() ", error);
        }
    }

    async updateById(productId, object) {
        try {
            const data = await this.getAll();
            const productIndex = data.findIndex(item => item.id == productId);
            if (productIndex >= 0) {
                const updatedObject = await {
                    ...object,
                    id: productId
                };
                data[productIndex] = updatedObject;
                await fs.promises.writeFile(this.archivo, JSON.stringify(data));
                return updatedObject;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Error metodo getById() ", error);
        }
    }

    async deleteById(numId) {
        try {
            const data = await this.getAll();
            const productIndex = data.findIndex(item => item.id == numId);
            if (productIndex >= 0) {
                data.splice(productIndex, 1);
                await fs.promises.writeFile(this.archivo, JSON.stringify(data));
                return `Producto con Id ${numId} eliminado`;
            } else {
                return false;
            }
        } catch (err) {
            console.log("Error metodo deleteById() ", error);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.unlink(this.archivo);
            console.log("Todo borrado");
        } catch (error) {
            console.log("Error en el metodo deleteAll()", error);
        }
    }
}

module.exports = Container;