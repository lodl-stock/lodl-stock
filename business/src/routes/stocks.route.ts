import {Router} from "express";
import { adminMiddleware, clientMiddleware } from "../middlewares";
import prisma from "../prisma_client";

const router = Router();

// Get total stock across all stores of all products
router.get('/', adminMiddleware, async (_ : any, res) => {
    const stocks = await prisma.product.findMany({
        include: {
            _count: {
                select: {
                    instances: true
                }
            }
        }
    });
    return res.json(stocks);
});

// Get stock of product identified by productId by store
router.get('/:productId', adminMiddleware, async (req, res) => {
    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) return res.json("Invalid productId");

    const stocks = await prisma.storeProduct.groupBy({
        by: ['storeId', 'productId'],
        where: { productId: productId },
        _count: { _all: true }
    })
    return res.json(stocks);
});

// Get stock of product identified by productId at store identified by storeId
router.get('/:productId/:storeId', clientMiddleware, async (req, res) => {
    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) return res.json("Invalid productId");
    const storeId = Number(req.params.storeId);
    if (Number.isNaN(storeId)) return res.json("Invalid storeId");

    const storeProduct = await prisma.storeProduct.findFirst({
        where: { storeId: storeId, productId: productId }
    });

    if (!storeProduct) {
        console.log({ where: { storeId: storeId, productId: productId } });
        return res.status(404).json("Product does not exist at this store!");
    }

    const stocks = await prisma.storeProductInstance.count({
        where: {
            storeProductId: storeProduct.id
        }
    })
    return res.json(stocks);
});

export default router;
