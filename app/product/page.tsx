import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Product Store
        </h1>
        <p className="text-gray-600 text-lg">Temukan produk terbaik untuk kebutuhan Anda</p>
      </header>

      {/* Single Product Card - Centered */}
      <div className="flex justify-center">
        <Card className="w-full max-w-md overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" 
              alt="Wireless Headphones"
              className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="destructive" className="font-semibold">
                -25%
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Wireless Headphones Premium
            </CardTitle>
            <CardDescription className="text-base">
              High-quality wireless headphones dengan noise cancellation dan battery life hingga 30 jam
            </CardDescription>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'stroke-current'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">(234 reviews)</span>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                Rp 299.000
              </span>
              <span className="text-lg text-gray-500 line-through">
                Rp 399.000
              </span>
            </div>

            {/* Product Features */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Bluetooth 5.0 Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Active Noise Cancellation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>30 Hours Battery Life</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-base transition-all duration-300"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Tambah ke Keranjang
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>1 Year Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>30 Days Return</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;