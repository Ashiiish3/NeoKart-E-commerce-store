import mongoose, { model, models, Schema, Document } from "mongoose";

interface ProductSchema extends Document {
  name: string;
  description: string;
  price: number;
  category: string[];
  brand: string;
  image: string;
  ratings: number;
//   reviews: string[];
  userId: Schema.Types.ObjectId;
}

const productShema = new Schema<ProductSchema>({
  name: String,
  description: String,
  price: Number,
  category: {
    type: [String],
    enum: [
      "Electronics",
      "Clothing",
      "Footwear",
      "Home",
      "Beauty",
      "Sports",
      "Toys",
      "Books",
      "Other",
    ],
  },
  brand: String,
  image: String,
  ratings: Number,
//   reviews: [],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

export const productModel =
  (models?.products as mongoose.Model<ProductSchema>) ||
  model<ProductSchema>("products", productShema);
