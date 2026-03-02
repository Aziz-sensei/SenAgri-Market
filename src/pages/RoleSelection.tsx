import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/Button';
import { Sprout, ShoppingBasket, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const RoleSelection = () => {
  const { setRole } = useUser();

  const handleSelect = (role: 'consumer' | 'producer') => {
    console.log('Role selected:', role);
    setRole(role);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-green-700 mb-4">SenAgri Market</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          La marketplace agricole qui connecte le terroir sénégalais directement à votre table.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-green-500 transition-all cursor-pointer group"
          onClick={() => handleSelect('consumer')}
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <ShoppingBasket size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Je suis Consommateur</h2>
          <p className="text-gray-600 mb-6">
            Je souhaite acheter des produits frais, locaux et des packs familiaux directement des producteurs.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('consumer');
            }}
          >
            Commencer mes achats <ArrowRight size={18} />
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-yellow-500 transition-all cursor-pointer group"
          onClick={() => handleSelect('producer')}
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
            <Sprout size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Je suis Producteur</h2>
          <p className="text-gray-600 mb-6">
            Je souhaite vendre mes récoltes, gérer mon stock et développer mon activité agricole.
          </p>
          <Button 
            variant="outline" 
            className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('producer');
            }}
          >
            Gérer mon exploitation <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
