import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { productModel } from "@/models/product.model";
import path from "path";
import { writeFile } from "fs/promises";
// import { promisify } from "util";
// import { upload } from "@/lib/multer";

export async function POST(req: NextRequest) {
  try {
    // const uploadMiddleware = promisify(upload.single("image"));

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

    if (!file) {
      return NextResponse.json({ error: "No files received." });
    }
    console.log(file, "file");
    // await uploadMiddleware(req, res)

    // for allowing types of images
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images, PDFs, and documents are allowed.",
        },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + "-" + file.name.split(" ").join("-");
    const filepath = `public/uploads/${filename}`;

    await writeFile(filepath, buffer);

    console.log(filename, "filename");
    console.log(filepath, "filepath");

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      brand,
      image: `/uploads/${filename}`,
      ratings,
      userId: decoded?.user?._id,
    });
    console.log(product);
    return NextResponse.json({
      message: "Product created successfully.",
      success: true,
      product,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error?.message : "internal server erorr";
    return NextResponse.json({
      message: errorMessage,
      success: false,
      error,
    });
  }
}

// getting all products
export async function GET(req: NextRequest) {
  await connectToDB();
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const query: any = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const getAllProducts = await productModel.find(query);
    console.log(getAllProducts);
    return NextResponse.json({
      message: "All Products get Successfully.",
      success: true,
      products: getAllProducts,
    });
  } catch (error) {
    return NextResponse.json({
      message: "internal server error",
      success: false,
      error,
    });
  }
}
