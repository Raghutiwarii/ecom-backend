import mongoose from "mongoose";

const CategorySceham = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySceham);
export default Category;

