import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10000);
    cb(null, uniqueSuffix + "-"  + file.originalname);
  }
});

export const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } })


export const config = {
  api: {
    bodyParser: false,
  },
};



export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await upload.single('image')(req, res, next);
      return NextResponse.json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      return req.json({message: "error while  uploading image"});
    }
  } else {
    return NextResponse.json({ message: 'Method Not Allowed' });
  }
}
