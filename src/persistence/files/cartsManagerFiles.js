import fs from "fs"
import uuid4 from "uuid4"
import { productsService } from "../index.js";


if (!fs.existsSync("src/files/carts.json")) {
    fs.writeFileSync("src/files/carts.json", "[]")
};
export  class CartsManagerFiles {
    constructor(path) {
        this.carts = [];
        this.path = path
    }
    async loadCarts() {
        try {
            this.carts = JSON.parse(fs.readFileSync(this.path))
        } catch (error) {
            console.log("Error carts loaded", error)
        }
    }

    async updateCarts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.log("Error carts loaded", error)
        }
    }

    async addCart() {
        await this.loadCarts()
        const id = uuid4();
         this.carts.push({
                id: id,
                products: []
            })
            await this.updateCarts();  
    }

    async getCarts() {
        await this.loadCarts()
        if (this.carts) {
            return this.carts
        } else {
            console.log("Cart not found");
        }
    }

    async getCartId(cid) {
        await this.loadCarts()
        const cartExist = this.carts.find(cart => cart.id == cid);
        if (cartExist) {
            return cartExist
        } else {
            return `Failed to get Cart, Cart ${cid} was not found`;
        }
    }

    async addProductsToCarts(cid, id) {
        await this.loadCarts()
        const indexCart = this.carts.findIndex(cart => cart.id == cid)
        const cartExist = this.carts.find(cart => cart.id == cid);
        const productExist = await productsService.getProductById(id);
        if (indexCart === -1) {
            return ("Cart does not exist");
        } else if (productExist === "Product not found") {
            return ("Product does not exist");
        } else {
            const productInCart = this.carts[indexCart].products.findIndex(prod => prod.idProduct == id)
            if (productInCart === -1) {

                this.carts[indexCart].products.push({
                    idProduct: id,
                    quantity: 1
                })
                await this.updateCarts()
            } else {
                this.carts[indexCart].products[productInCart].quantity++

                await this.updateCarts()
            }
        }
    }
    async deleteCartById(id) {
        try {
            await this.loadCarts()
            let cartIndex =this.carts.findIndex(prod=> prod.id == id)
            if (cartIndex ===-1) {
                return "Cart not found"
            }
 
            this.carts.splice(cartIndex,1)
   
        const productsString = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, productsString);
            return "Cart deleted successfully";

        } catch (error) {
            console.log(error);
        }
    }
}


const cart = new CartsManagerFiles("carts.json");











// export class CartsManagerFiles{
//     constructor(path){
//         this.pathFile=path
//     }

//     fileExist(){
//         return fs.existsSync(this.pathFile)
//     }

//     async getCarts(){
//         try {
//             if(this.fileExist()){
//                 const contenidoString= await fs.promises.readFile(this.pathFile,"utf-8")
//                 const carts=JSON.parse(contenidoString)
//                 return carts
//             }else{
//                 throw new Error("No se pudieron obtener los carritos")
//             }
//         } catch (error) {
//             throw error
//         }
//     }
//     async createCart(){
//         try {
//             if(this.fileExist()){
//                 const contenidoString= await fs.promises.readFile(this.pathFile,"utf-8")
//                 const carts=JSON.parse(contenidoString)
//                 const newCart={                 
//                         id: uuid4(),
//                         products:[]
//                 }
//                 carts.push(newCart)
//                 await fs.promises.writeFile(this.pathFile,JSON.stringify(carts,null,`\t`))
//                 return newCart
//             }else{
//                 throw new Error("No se pudieron obtener los carritos")
//             }
//         } catch (error) {
//             throw error
//         }
//     }

// }