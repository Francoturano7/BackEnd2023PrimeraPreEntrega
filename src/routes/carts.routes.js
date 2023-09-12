import { Router } from "express";
import { cartsService } from "../persistence/index.js";

const router=Router()

router.get("/",async(req,res)=>{
   try {
     const carts=  await cartsService.getCarts()
     res.json({data:carts})
   } catch (error) {
       res.json({error:error.message})
   }
})

router.post("/", async (req, res) => {
    try {
      const addCart = await cartsService.addCart();
  
      addCart ?
        res.status(400).json({
          status: "error",
          msg: 'Error in uploaded data'
        }) :
        res.status(200).json({
          status: "success",
          msg: 'Cart added successfully',
        })
    } catch (error) {
      console.log(error);
    }
  
  });

router.get("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const idFound = await cartsService.getCartId(cid)
  
     
      idFound === `Failed to get Cart, Cart ${cid} was not found` ?
        res.status(404).json({
          status: "error",
          msg: idFound,
  
        }) :
        res.status(200).json({
          status: "success",
          msg: "Displaying  product",
          data: idFound
        })
  
    } catch (error) {
      console.log(error);
    }
  
  
  });

  router.post("/:cid/product/:pid", async (req, res) => {
    try {
  
      let { cid, pid } = req.params;
      const addProductToCart = await cartsService.addProductsToCarts(cid, pid)
      if (addProductToCart === "Cart does not exist" || addProductToCart === "Product does not exist") {
        return res.status(404).json({
          status: "error",
          msg: addProductToCart,
  
        })
      }
      else {
        res.status(200).json({
          status: "success",
          msg: "Producto agregado con exito",
          data: addProductToCart
        })
      }
  
    } catch (error) {
      console.log(error);
    }
  })

  router.delete("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const cartDelete = await cartsService.deleteCartById(cid)
  
      if (cartDelete === "Cart not found") {
        return res.status(404).json({
          status: "error",
          msg: cartDelete,
  
        })
      } else {
        res.status(200).json({
          status: "success",
          msg: cartDelete,
  
        })
      }
    } catch (error) {
      console.log(error);
    }
  
  
  
  });

export {router as cartsRouter}