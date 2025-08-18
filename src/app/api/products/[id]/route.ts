import { productModel } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import path from "path";
import fs, { writeFileSync } from "fs";
import { writeFile } from "fs/promises";

// user only see single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDB();
  const { id } = await params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return NextResponse.json({
        message: "Product not found.",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Product get Successfully.",
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json({
      message: "internal server error",
      success: false,
      error,
    });
  }
}

// update product only admin
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    if (decoded?.user?.role !== "admin") {
      return NextResponse.json({
        message: "You don't have permission to access this.",
        success: false,
      });
    }
    await connectToDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price");
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const file = formData.get("image") as File;
    const ratings = formData.get("ratings") as string;

    const product = await productModel.findById(id);
    if (!product) {
      return NextResponse.json({
        message: "Product not found.",
        success: false,
      });
    }

    let imageUrl = product.image;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = Date.now() + "-" + file.name.split(" ").join("-");
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        brand,
        image: imageUrl,
        ratings,
      },
      { new: true }
    );
    return NextResponse.json({
      message: "Products has been updated successfully.",
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({
      message: "internal server error",
      success: false,
      error,
    });
  }
}

// delete product only admin
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDB();
  const { id } = await params;
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    if (decoded?.user?.role !== "admin") {
      return NextResponse.json({
        message: "You don't have permission to access this.",
        success: false,
      });
    }
    const product = await productModel.findById(id);
    if (!product) {
      return NextResponse.json({
        message: "Product not found.",
        success: false,
      });
    }
    await productModel.findByIdAndDelete(id);
    return NextResponse.json({
      message: "Product has been deleted successfully.",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "internal server error",
      success: false,
      error,
    });
  }
}