import React, { useState } from 'react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart, user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleRatingSubmit = async () => {
    if (!user) {
      alert('Please login to submit a rating');
      return;
    }
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    // Here you can add API call to submit rating
    console.log('Rating submitted:', { rating, review, productId: product._id });
    alert('Thank you for your rating!');
    setRating(0);
    setReview('');
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">⭐ {product.rating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock Available</p>
                  <p className="text-2xl font-bold text-green-700">{product.stock}</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-4xl font-bold text-green-700 mb-4">৳{product.price}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{product.info}</p>
              </div>

              {/* Quantity Selector */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
              >
                {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              {user ? 'Rate This Product' : 'Login to Rate This Product'}
            </h4>
            
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl focus:outline-none transition-transform hover:scale-110"
                      >
                        {(hoverRating || rating) >= star ? (
                          <span className="text-yellow-500">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-green-700 font-semibold ml-2">
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                </div>

                <button
                  onClick={handleRatingSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Submit Rating
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Please <a href="/login" className="text-green-700 font-semibold underline">login</a> to rate and review this product.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
