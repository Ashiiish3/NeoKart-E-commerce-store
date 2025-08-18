type ProductProps = {
  _id: string;
  name: string;
  price: number;
  image: string;
  ratings: number;
};

export default function ProductCard({ name, price, image, ratings }: ProductProps) {
  return (
    <div className="border rounded-md p-4 shadow hover:shadow-lg transition">
      <img src={image} alt={name} className="w-full h-48 object-cover mb-4" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">₹{price}</p>
      <p className="text-yellow-500">⭐ {ratings}</p>
    </div>
  );
}