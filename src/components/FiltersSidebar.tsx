// app/(routes)/products/FiltersSidebar.tsx
"use client";

interface FiltersSidebarProps {
  onFilterChange: (filters: any) => void;
}

const FiltersSidebar = ({ onFilterChange }: FiltersSidebarProps) => {
  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="font-semibold mb-2">Filters</h3>
      <div className="mb-2">
        <label>Category:</label>
        <select
          className="w-full border rounded px-2 py-1"
          onChange={(e) =>
            onFilterChange((prev: any) => ({
              ...prev,
              category: e.target.value || undefined,
            }))
          }
        >
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Sports">Shoes</option>
        </select>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="number"
          placeholder="Min Price"
          className="border rounded px-2 py-1 w-full"
          onChange={(e) =>
            onFilterChange((prev: any) => ({
              ...prev,
              minPrice: e.target.value,
            }))
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          className="border rounded px-2 py-1 w-full"
          onChange={(e) =>
            onFilterChange((prev: any) => ({
              ...prev,
              maxPrice: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default FiltersSidebar;
