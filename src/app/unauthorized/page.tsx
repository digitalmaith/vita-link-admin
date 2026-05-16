"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Barre de couleur supérieure */}
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
          
          <div className="p-8 text-center space-y-6">
            {/* Icône d'avertissement */}
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldAlert className="h-10 w-10 text-red-600" />
              </div>
            </div>

            {/* Titre et message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Accès refusé
              </h1>
              
              <div className="h-1 w-12 bg-red-500 rounded-full mx-auto" />
              
              <p className="text-gray-600 leading-relaxed">
                Votre compte n'a pas les permissions nécessaires
                <br />
                pour accéder à <span className="font-semibold text-gray-900">Vita-Link Admin</span>.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la page de connexion
              </Button>
              
              <button
                onClick={() => router.back()}
                className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Revenir à la page précédente
              </button>
            </div>

            {/* Pied de page */}
            <div className="pt-4">
              <p className="text-xs text-gray-400">
                Besoin d'aide ? Contactez votre administrateur.
              </p>
            </div>
          </div>
        </div>

        {/* Élément décoratif */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className="h-px w-8 bg-gray-300" />
            <span>Vita-Link Admin</span>
            <div className="h-px w-8 bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}