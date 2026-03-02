import { useProducts } from '../contexts/ProductContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { motion } from 'motion/react';

export const CatalogPage = ({ filterPacks = false }: { filterPacks?: boolean }) => {
  const { products, loading } = useProducts();
  
  const filteredProducts = products.filter(p => 
    filterPacks ? p.isPack : !p.isPack && p.stock > 0
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Chargement des produits frais...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {filterPacks ? 'Nos Packs Agricoles' : 'Produits du Terroir'}
        </h1>
        <p className="text-gray-500">
          {filterPacks 
            ? 'Des sélections optimisées pour vos besoins familiaux ou individuels.' 
            : 'Frais, locaux et de saison. Directement de nos champs à votre panier.'}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">Aucun produit disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};
