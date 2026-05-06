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
      const res = await API.get("/products");
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
      await API.post("/admin/products", formData);
      
      toast.success("Product created successfully!");
      
      // Close modal on success
      setIsModalOpen(false);
      setEditingProduct(null);
      
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
      await API.put(`/admin/products/${editingProduct._id}`, formData);
      
      toast.success("Product updated successfully!");
      
      // Close modal on success
      setIsModalOpen(false);
      setEditingProduct(null);
      
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
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 py-16 text-center">
        <p className="text-gray-500 text-lg">Failed to load products</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormError("");
            setEditingProduct(null);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                          {product.category && (
                            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-3">
                      <span className="text-base font-bold text-purple-600">${product.price}</span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProduct === product._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white rounded-xl shadow-md border border-gray-100 py-16 text-center">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-2">Get started by adding your first product</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        {formError && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">Failed to save product</p>
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