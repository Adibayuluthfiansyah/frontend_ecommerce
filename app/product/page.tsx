import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Header from '@/components/header/header';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  features: string[];
  discount?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductList: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Wireless Headphones Premium",
      price: "Rp 299.000",
      originalPrice: "Rp 399.000",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "High-quality wireless headphones dengan noise cancellation",
      features: ["Bluetooth 5.0", "Active Noise Cancellation", "30 Hours Battery"],
    },

     {
         //Tambahkan untuk produk baru:
        id: 2,
        name: "Macbook",
        price: "Rp 11.500.000",
        originalPrice: "Rp 14.000.0000", 
        image: "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, atque!" ,
       features: ["Feature 1", "Feature 2", "Feature 3"], 
      },
           {
         //Tambahkan untuk produk baru:
        id: 3,
        name: "Airpods",
        price: "Rp 2.700.000",
        originalPrice: "Rp 3.200.0000", 
        image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, atque!",
       features: ["Feature 1", "Feature 2", "Feature 3"], 
      }
  ];

  return (

    <div className="min-h-screen bg-gray-50 ">
      {/* Header - Simple */}      
      <Header/>
      <div className="text-center pt-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Product List</h1>
        <p className="text-gray-600">Temukan produk terbaik untuk kebutuhan Anda</p>
      </div>


      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Component Kartu Produk - Simple & Reusable with TypeScript
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-5">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {/* Discount Badge - Static */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            -{product.discount}
          </div>
        )}
        {/* Heart Button */}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-sm text-gray-500 ml-2">(234 reviews)</span>
        </div>

        {/* Price  */}
        <div className="flex items-center mb-4">
          <span className="text-xl font-bold text-blue-600">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="mb-4">
          {product.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center text-sm text-gray-600 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {feature}
            </div>
          ))}
        </div>

        {/* Buy Button */}
        <button className="hover:cursor-pointer w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductList;