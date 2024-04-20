import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function range(limit: number) {
  return [...Array(limit).keys()];
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomDate(date1: string, date2: string) {
  function randomValueBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  if (d1 > d2) {
    return new Date(randomValueBetween(d2, d1)).toISOString();
  } else {
    return new Date(randomValueBetween(d1, d2)).toISOString();
  }
}

function randomSubarray<T>(arr: Array<T>, size: number): Array<T> {
  const shuffled = arr.slice(0);
  for (let i = arr.length - 1; i != -1; --i) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

const users = [
  {
    "email": "maria.teaca16@gmail.com",
    "first_name": "Maria",
    "last_name": "Teaca",
    "phone": "0773360302"
  },
];

const products = [
  {
    stock: 5,
    price: 5,
    product: {
      "name": "Mandarina"
    }
  },
  {
    stock: 2,
    price: 2,
    product: {
      "name": "Portocala"
    }
  },
  {
    stock: 7,
    price: 7,
    product: {
      "name": "Vanilla Twist"
    }
  },
  {
    stock: 4,
    price: 4,
    product: {
      "name": "Seminte de capsuni"
  }}
]

const stores = [
  {
    "name": "Lidl Politehnica"
  }
]

async function seedOne(collection: any, defaults: Array<any>, key: string) {
  let existing = await collection.findMany();
  const mustAdd = defaults.filter(
    (x) => !existing.map((e: any) => e[key]).includes(x[key])
  );
  await Promise.all(
    mustAdd.map((m) => collection.create({ data: m }))
  );
}

async function main(del: boolean) {
  await prisma.$connect();

  if (del) {
    console.log(`deleted ${(await prisma.subscription.deleteMany()).count} from subscription`);
    console.log(`deleted ${(await prisma.storeProduct.deleteMany()).count} from storeProduct`);
    console.log(`deleted ${(await prisma.product.deleteMany()).count} from product`);
    console.log(`deleted ${(await prisma.user.deleteMany()).count} from user`);
  }
  seedOne(prisma.product, products.map(p => p.product), "name");
  seedOne(prisma.user, users, "email");
  seedOne(prisma.store, stores, "name");

  products.map(async (p) => {
    const product = await prisma.product.findFirst({ where: { name: p.product.name } });
    const stores = await prisma.store.findMany({});
    if (!product) return;

    stores.forEach(async (s: any) => {
      const existing = await prisma.storeProduct.findMany({
        where: { productId: product.id, storeId: s.id }
      });
      if (existing.length >= p.stock) return;

      for (let i = 0; i != p.stock - existing.length; i++) {
        await prisma.storeProduct.create({
          data: {
            price: p.price,
            storeId: s.id,
            productId: product.id
          }
        });
      }
    });
  })
}

export default function seed() {
  main(false)
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
