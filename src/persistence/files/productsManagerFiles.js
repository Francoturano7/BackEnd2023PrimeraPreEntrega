import fs from "fs"
import uuid4 from "uuid4"

export class ProductsManagerFiles {
    constructor(path) {
        this.path = path
        this.products = []
    }
    
loadDB = async () => {
         
    if (fs.existsSync(this.path)) {
        const productsString = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(productsString);
        this.products = products;
       
    }
}
async getProducts() {
    try {
        await this.loadDB()
        return this.products;
    } catch (error) {
        console.log(error);
    }
}
async getProductById(idProduct) {
    try{
        const product = await this.getProducts()
        const productFound=product.find(prod => prod.id == idProduct)
        if (productFound) {
            return productFound
        } else {
            console.log("Product not found")
        }
    } catch (error) {
        console.log("error", error.message)
    }
    
      
}
async addProduct(product) {
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = product
        const products = await this.getProducts()
        if (!title || !description || !code || !price || !stock || !category) {
            return "All fields are required"
        }
        if (products.some(prod => prod.code == code)) {
            return "Invalid product duplicate code"
        }
        this.products.push({
            ...product,
            id: uuid4(),
            status: status ?? true,
            thumbnails: thumbnails ?? [],
        })
        const productsString = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, productsString);
        return "Product added successfully";
    } catch (error) {
        console.log(error);
    }
}
async updateProduct(id, product) {
    try {
        const allProducts=  await this.getProducts()
         let productIndex =this.products.findIndex(prod=> prod.id == id)
         if (productIndex === -1) {
             return "Product not found"
         }
         if (product.id) {
             return "Cannot modify id field"
         }
       
        this.products[productIndex]= { ...this.products[productIndex], ...product }
           
         const productsString = JSON.stringify(this.products, null, 2);
         await fs.promises.writeFile(this.path, productsString);
         return "Product updated successfully";

     } catch (error) {
         console.log(error);
     }
 }
async deleteProducts(id) {
    try {
        const products = await this.getProducts()
        let productIndex =this.products.findIndex(prod=> prod.id == id)
        if (productIndex ===-1) {
            return "Product not found"
        }

        this.products.splice(productIndex,1)

    const productsString = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, productsString);
        return "Product deleted successfully";

    } catch (error) {
        console.log(error);
    }
}

}
