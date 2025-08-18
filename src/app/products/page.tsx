"use client";

import FiltersSidebar from "@/components/FiltersSidebar";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState<any>({});
  const getProducts = async () => {
    try {
      const params = new URLSearchParams();
      console.log(params, "params")
      
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      console.log(params, "params")
      const res = await axios.get(
        `http://localhost:3000/api/products?${params.toString()}`
      );
      console.log(res?.data?.products);
      setProducts(res?.data?.products);
    } catch (error) {
      console.log("error while getting products", error);
    }
  };
  useEffect(() => {
    getProducts();
  }, [filters]);
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <FiltersSidebar onFilterChange={setFilters} />
        </aside>
        <main className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.length ? (
            products.map((product: any) => (
              <ProductCard key={product._id} {...product} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </main>
      </div>
    </div>
  );
}
