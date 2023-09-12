import { Router } from "express";
import { productsService } from "../persistence/index.js";

const router = Router();


router.get("/",async(req,res)=>{
    try {
        const products = await productsService.getProducts();
        res.json({message:"listado de productos",data:products});
    } catch (error) {
        res.json({status:"error",message:error.message});
    }
});

router.post("/", async(req,res)=>{
    try {
        const product= req.body
        const productAdd = await productsService.addProduct(product)
        productAdd === "Product added successfully" ?
            res.status(200).json({
                status: "success",
                msg: productAdd,
            }) :
            res.status(404).json({
                status: "error",
                msg: productAdd,
            })
            } catch (error) {
                console.log(error);
            }
        })

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const productById = await productsService.getProductById(id)
        console.log(productById);
        productById === "Product not found" ?
            res.status(404).json({
                status: "error",
                msg: productById,
            }) :

            res.status(200).json({
                status: "success",
                msg: " Product found ",
                data: productById
            })

    } catch (error) {
        console.log(error);
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product= req.body
        const productUpdated = await productsService.updateProduct(pid,product)
        productUpdated === "Product updated successfully" ?
            res.status(200).json({
                status: "success",
                msg: productUpdated,
            }) :
            res.status(404).json({
                status: "error",
                msg: productUpdated,
            })
    } catch (error) {
        console.log(error);
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
       // id=parseFloat(id)
       console.log("params",typeof(pid));
               const productDeleted = await productsService.deleteProducts(pid)
               productDeleted === "Product deleted successfully" ?
                   res.status(200).json({
                       status: "success",
                       msg: productDeleted,
                   }) :
                   res.status(404).json({
                       status: "error",
                       msg: productDeleted,
                   })
           } catch (error) {
               console.log(error);
           }
       })

export {router as productsRouter};