import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useUser } from '../contexts/UserContext';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Settings, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthPage = () => {
  const { setRole } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    console.log('Supabase Configuration Check:', {
      isConfigured,
      urlExists: !!import.meta.env.VITE_SUPABASE_URL,
      keyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    });
    setConfigured(isConfigured);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      setError("Supabase n'est pas configuré. Veuillez ajouter VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les secrets d'AI Studio.");
      return;
    }

    setLoading(true);
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password: cleanPassword 
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password: cleanPassword 
        });
        if (error) throw error;
        alert('Vérifiez votre boîte mail pour confirmer votre inscription !');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {!configured && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-start gap-3 text-yellow-800 text-sm">
            <Settings className="shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold mb-1">Configuration requise</p>
              <p>Veuillez ajouter vos identifiants Supabase dans les <strong>Secrets</strong> d'AI Studio pour activer l'authentification.</p>
            </div>
          </div>
        )}
        <div className="text-center mb-8 relative">
          <button 
            onClick={() => setRole(null)}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 transition-colors"
            title="Changer de rôle"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-green-700 mb-2">SenAgri Market</h1>
          <p className="text-gray-500">Connectez-vous pour accéder au terroir</p>
        </div>

        <Card className="p-8">
          <div className="flex border-b border-gray-100 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-sm font-bold transition-all ${isLogin ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
            >
              SE CONNECTER
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-sm font-bold transition-all ${!isLogin ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
            >
              S'INSCRIRE
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? 'Chargement...' : isLogin ? (
                <><LogIn size={18} /> Se connecter</>
              ) : (
                <><UserPlus size={18} /> S'inscrire</>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
