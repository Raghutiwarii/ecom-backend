import mongoose from "mongoose";
import { Product, Category } from "./src/models/index.js";
import { categories, products } from "./seedData.js";
import "dotenv/config";

async function seedDatabase() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDcos = await Category.insertMany(categories);
    const categoryMap = categoryDcos.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productMap = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));
    await Product.insertMany(productMap);
    console.log("seed success");
  } catch (e) {
    console.log("getting error while seeding data ", e);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
