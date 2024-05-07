import {Router} from "express";
import { adminMiddleware, clientMiddleware } from "../middlewares";
import prisma from "../prisma_client";

const router = Router();

// Get total stock across all stores of all products
router.get('/', adminMiddleware, async (_ : any, res) => {
    const stocks = await prisma.storeProductInstance.count();
    return res.json(stocks);
});

// Get stock of product identified by productId by store
router.get('/:productId', adminMiddleware, async (req, res) => {
    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) return res.json("Invalid productId");

    const stocks = await prisma.storeProductInstance.groupBy({
        by: ['storeProductId'],
        where: { storeProduct: { productId: productId } },
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
    });
    return res.json(stocks);
});

router.post('/:storeId/checkout', clientMiddleware, async (req, res) => {
    let errs: string[] = [];

    try {
        const products = req.body;
        const deleteProducts = products.map(async (product: any) => {
            let count = await prisma.storeProductInstance.count({
                where: { storeProductId: product.id}
            }); 

            let min_count = count;

            if (min_count < product.count) {
                errs.push(`Stock for product with id ${product.id} is lower(${min_count}) than actual(${product.count})`);
            } else {
                min_count = product.count;
            }

            const rowsToDelete = await prisma.storeProductInstance.findMany({
                select: {
                  id: true,
                },
                where: {
                    storeProductId: product.id
                },
                take: min_count,
              });
          
              // Extract the IDs from the result
              const idsToDelete = rowsToDelete.map((row : any) => row.id);
          
              // Delete the rows using the extracted IDs
              await prisma.storeProductInstance.deleteMany({
                where: {
                  id: {
                    in: idsToDelete,
                  },
                },
              });
        });

        await Promise.all(deleteProducts);

        return res.send({errors: errs });
    } catch (err) {
        console.log(err)
        return res.send(`Failed to checkout products ${req.body}`);
    }
});

router.post('/restock', adminMiddleware, async (req, res) => {
    let errs: string[] = [];
    try {
        const products = req.body;
        const addedProducts = products.map(async (product: any) => {
            let prod = await prisma.storeProduct.findUnique({ where: { id: product.id} });
            if (prod == null) {
                errs.push(`Store Product with id ${product.id} does not exist`);
            } else {
                for (let it = 0; it < product.count; it++) {
                    await prisma.storeProductInstance.create({
                        data: {
                            "storeProductId": product.id
                        }
                    });
                }
            }
        });

        await Promise.all(addedProducts);

        return res.send({errors: errs });
    } catch (err) {
        console.log(err)
        return res.send(`Failed to restock products ${req.body}`);
    }
});

router.post('/addproduct', adminMiddleware, async (req, res) => {
    let errs: string[] = [];
    try {
        const products = req.body;
        const addedProducts = products.map(async (product: any) => {
            let prod = await prisma.product.findUnique({ where: { name: product.name} });
            if (prod) {
                errs.push(`Product ${product.name} already exists`);
            } else {
                await prisma.product.create({
                    data: {
                        "name": product.name
                    }
                });
            }
        });

        await Promise.all(addedProducts);

        return res.send({errors: errs });
    } catch (err) {
        console.log(err)
        return res.send(`Failed to add products ${req.body}`);
    }
});

router.post('/:storeId/addproduct', adminMiddleware, async (req, res) => {
    try {
        const products = req.body;
        const addedProducts = products.map(async (product: any) => {
            await prisma.storeProduct.create({
                data: {
                    "productId": product.productId,
                    "storeId": +req.params.storeId,
                    "price": product.price
                }
            });
        });

        await Promise.all(addedProducts);

        return res.send(200);
    } catch (err) {
        console.log(err)
        return res.send(`Failed to add products to store ${req.body}`);
    }
});

export default router;
