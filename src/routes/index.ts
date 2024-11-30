import express, { Router } from 'express';
import orderRoutes from "./orderRoutes";
import productRoutes from "./productRoutes";


const routes = Router();

routes.use("/orders", orderRoutes);
routes.use("/product", productRoutes);



export default routes;