import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Modal from "../../components/common/Modal";
import ProductForm from "../../components/admin/ProductForm";
import { TableRowSkeleton } from "../../components/common/Skeleton";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/products");
      // Handle different response structures
      const productList = res.data.items || res.data.products || res.data.data || res.data;
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      setSubmitting(true);
      setFormError("");
      
      // Send POST request to create product
      const res = await API.post("/admin/products", formData);
      const createdProduct = res.data.data || res.data.product || res.data;
      
      toast.success("Product created successfully!");
      
      // Close modal on success
      setIsModalOpen(false);
      setEditingProduct(null);
      
      if (createdProduct && createdProduct._id) {
        setProducts((prevProducts) => [createdProduct, ...prevProducts]);
      }

      // Refetch products to show the new product
      await fetchProducts();
      
    } catch (err) {
      // Handle error messages
      const errorMessage = err.response?.data?.message || "Failed to create product";
      setFormError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      setSubmitting(true);
      setFormError("");
      
      // Send PUT request to update product
      const res = await API.put(`/admin/products/${editingProduct._id}`, formData);
      const updatedProduct = res.data.data || res.data.product || res.data;
      
      toast.success("Product updated successfully!");
      
      // Close modal on success
      setIsModalOpen(false);
      setEditingProduct(null);
      
      if (updatedProduct && updatedProduct._id) {
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
        );
      }

      // Refetch products to show updated data
      await fetchProducts();
      
    } catch (err) {
      // Handle error messages
      const errorMessage = err.response?.data?.message || "Failed to update product";
      setFormError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    setFormError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormError("");
  };

  const handleDeleteProduct = async (product) => {
    // Confirm before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingProduct(product._id);
      
      // Call DELETE endpoint
      await API.delete(`/admin/products/${product._id}`);
      
      toast.success("Product deleted successfully!");
      
      // Remove product from UI after success
      setProducts((prevProducts) => 
        prevProducts.filter((p) => p._id !== product._id)
      );
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
      console.error("Error deleting product:", err);
    } finally {
      setDeletingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Catalog</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Products</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your product inventory</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-gray-200 bg-white py-16 text-center shadow-sm">
        <p className="text-lg text-gray-500">Failed to load products</p>
        <button
          onClick={fetchProducts}
          className="mt-4 rounded-full bg-[#0A0A0A] px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Catalog</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Products</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormError("");
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-[#FAFAFA]">
                    {/* Name */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#FAFAFA]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-5 w-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0A0A0A]">{product.name}</p>
                          {product.category && (
                            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-3">
                      <span className="font-mono text-base font-bold text-[#0A0A0A]">${product.price}</span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${
                          product.stock > 10
                            ? "bg-emerald-50 text-emerald-700"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(product)}
                          className="rounded-xl p-2 text-[#0A0A0A] transition-colors hover:bg-gray-100"
                          title="Edit product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProduct === product._id}
                          className="rounded-xl p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-lg text-gray-500">No products found</p>
          <p className="mt-2 text-sm text-gray-400">Get started by adding your first product</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        {formError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">{formError}</p>
          </div>
        )}
        <ProductForm
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          initialData={editingProduct}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}

export default Products;