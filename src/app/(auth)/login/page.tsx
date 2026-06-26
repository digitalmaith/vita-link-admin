"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Droplet, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Identifiants invalides. Veuillez réessayer.");
      setIsLoading(false);
    } 
    if (result?.ok) {
      const session = await getSession();

      if ((session?.user as any)?.role !== "ADMIN") {
        router.push("/unauthorized");
        return;
      }

      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-950">
      {/* Panneau gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-neutral-950">
        {/* Motif de fond abstrait */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(239,68,68,0.1),transparent_50%)]"></div>
        </div>

        {/* Grille décorative */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}>
        </div>

        {/* Contenu du panneau gauche */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <Droplet className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">Vita-Link</span>
          </div>

          {/* Citation */}
          <div className="space-y-6">
            <div className="w-12 h-px bg-gradient-to-r from-red-500 to-transparent"></div>
            <blockquote className="text-xl font-medium text-white/90 leading-relaxed tracking-wide">
              "PARCE QU'AUCUNE VIE NE DEVRAIT S'ÉTEINDRE À CAUSE D'UNE RUPTURE D'INFORMATION.
"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-300 text-xs font-medium">SN</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">Plateforme Nationale</p>
                <p className="text-xs text-white/40">Gestion des Dons de Sang • Sénégal</p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "150+", label: "Hôpitaux" },
              { value: "50K+", label: "Donneurs" },
              { value: "24/7", label: "Disponible" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* En-tête mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20">
              <Droplet className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">Vita-Link</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-[0.2em]">Portail Administrateur</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Bienvenue
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Connectez-vous pour accéder au tableau de bord de gestion des dons de sang.
            </p>
          </div>

          {/* Carte formulaire */}
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vita-link.sn"
                  className="w-full px-4 py-3 text-sm bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full px-4 py-3 pr-12 text-sm bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-white text-black hover:bg-neutral-200 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authentification...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-neutral-900/50 text-xs text-neutral-600">
                  Sécurisé
                </span>
              </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-600">
              <Shield className="w-3 h-3" />
              <span>Accès restreint • Authentification requise</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-neutral-700">
            © {new Date().getFullYear()} Vita-Link Sénégal
          </p>
        </div>
      </div>
    </div>
  );
}