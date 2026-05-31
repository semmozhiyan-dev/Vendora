import { useState, useEffect } from "react";

function ProductForm({ onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        stock: initialData.stock || "",
        category: initialData.category || "",
          image: initialData.image || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert price and stock to numbers before submitting
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };
    onSubmit(dataToSubmit);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3.5 text-gray-900 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
          placeholder="Enter product name"
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full resize-none rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3.5 text-gray-900 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
          placeholder="Enter product description"
        />
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3.5 text-gray-900 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
          placeholder="e.g., Electronics, Clothing, Books"
        />
      </div>

      {/* Price and Stock Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Field */}
        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-semibold text-gray-700">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full rounded-2xl border border-gray-200 bg-[#FAFAFA] py-3.5 pl-8 pr-4 text-gray-900 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Stock Field */}
        <div>
          <label htmlFor="stock" className="mb-2 block text-sm font-semibold text-gray-700">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3.5 text-gray-900 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
            placeholder="0"
          />
        </div>
      </div>

      {/* Image Field */}
      <div>
        <label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3.5 text-gray-900 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
          placeholder="/images/products/image1.jpg or https://..."
        />
        <p className="mt-2 text-xs text-gray-500">
          Use a public image path or URL so the client catalog can display the product.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#0A0A0A] px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save" : "Create")}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
