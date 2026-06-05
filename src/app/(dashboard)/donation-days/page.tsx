"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CalendarDays,
    Search,
    Ban,
    Loader2,
    Filter,
    X,
    AlertTriangle,
    Building2,
    MapPin,
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
} from "lucide-react";

import { donationDayService } from "@/services/donation-days.service";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type DonationDayStatus =
    | "DRAFT"
    | "PUBLISHED"
    | "CANCELLED"
    | "COMPLETED";

export default function DonationDaysPage() {
    const [status, setStatus] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");
    
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        dayId: string | null;
        dayTitle: string | null;
    }>({
        isOpen: false,
        dayId: null,
        dayTitle: null,
    });

    const queryClient = useQueryClient();

    const filters = useMemo(
        () => ({
            page: 1,
            limit: 20,
            status:
                status === "all"
                    ? undefined
                    : (status as DonationDayStatus),
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            search: search || undefined,
        }),
        [status, startDate, endDate, search]
    );

    const { data, isLoading } = useQuery({
        queryKey: ["donation-days", filters],
        queryFn: () => donationDayService.getAll(filters),
    });

    const donationDays = data?.data ?? [];
    const total = data?.pagination?.total ?? 0;

    // Statistiques calculées
    const stats = {
        total: total,
        published: donationDays.filter((d: any) => d.status === "PUBLISHED").length,
        completed: donationDays.filter((d: any) => d.status === "COMPLETED").length,
        cancelled: donationDays.filter((d: any) => d.status === "CANCELLED").length,
    };

    const suspendMutation = useMutation({
        mutationFn: (id: string) => donationDayService.suspend(id),
        onSuccess: (response) => {
            toast.success(response?.message || "Journée suspendue avec succès !");
            queryClient.invalidateQueries({ queryKey: ["donation-days"] });
            setConfirmDialog({ isOpen: false, dayId: null, dayTitle: null });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Une erreur est survenue lors de la suspension");
            setConfirmDialog({ isOpen: false, dayId: null, dayTitle: null });
        }
    });

    const handleSuspendClick = (dayId: string, dayTitle: string) => {
        setConfirmDialog({
            isOpen: true,
            dayId: dayId,
            dayTitle: dayTitle,
        });
    };

    const handleConfirmSuspend = () => {
        if (confirmDialog.dayId) {
            suspendMutation.mutate(confirmDialog.dayId);
        }
    };

    const getStatusBadge = (status: DonationDayStatus) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-0 hover:bg-emerald-500/20">Publié</Badge>;
            case "COMPLETED":
                return <Badge className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-0 hover:bg-blue-500/20">Terminé</Badge>;
            case "CANCELLED":
                return <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-0 hover:bg-red-500/20">Annulé</Badge>;
            default:
                return <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Brouillon</Badge>;
        }
    };

    const resetFilters = () => {
        setStatus("all");
        setStartDate("");
        setEndDate("");
        setSearch("");
    };

    const hasActiveFilters = status !== "all" || startDate || endDate || search;

    const StatCard = ({ title, value, icon: Icon, colorLight, colorDark }: any) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full ${colorLight} dark:${colorDark} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-background min-h-screen">
            <div className="p-8 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Journées de don</h1>
                    <p className="text-muted-foreground">Gérez toutes les campagnes de collecte de sang</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        title="Total des campagnes" 
                        value={stats.total} 
                        icon={CalendarDays} 
                        colorLight="bg-gradient-to-r from-purple-500 to-purple-600"
                        colorDark="bg-gradient-to-r from-purple-600 to-purple-700"
                    />
                    <StatCard 
                        title="Publiées" 
                        value={stats.published} 
                        icon={CheckCircle} 
                        colorLight="bg-gradient-to-r from-emerald-500 to-emerald-600"
                        colorDark="bg-gradient-to-r from-emerald-600 to-emerald-700"
                    />
                    <StatCard 
                        title="Terminées" 
                        value={stats.completed} 
                        icon={TrendingUp} 
                        colorLight="bg-gradient-to-r from-blue-500 to-blue-600"
                        colorDark="bg-gradient-to-r from-blue-600 to-blue-700"
                    />
                    <StatCard 
                        title="Annulées" 
                        value={stats.cancelled} 
                        icon={XCircle} 
                        colorLight="bg-gradient-to-r from-red-500 to-red-600"
                        colorDark="bg-gradient-to-r from-red-600 to-red-700"
                    />
                </div>

                {/* Filters */}
                <div className="bg-card rounded-xl border shadow-sm mb-8">
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                                        <SelectItem value="PUBLISHED">Publié</SelectItem>
                                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                                        <SelectItem value="CANCELLED">Annulé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Date de début</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Date de fin</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Recherche</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Titre, lieu..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={resetFilters}
                                    size="sm"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Réinitialiser
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold text-foreground">Liste des journées</h2>
                            </div>
                            <Badge variant="secondary">
                                {donationDays.length} résultat(s)
                            </Badge>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="text-center">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                                <p className="text-muted-foreground">Chargement...</p>
                            </div>
                        </div>
                    ) : donationDays.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <CalendarDays className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-xl text-foreground mb-2">Aucune journée trouvée</h3>
                            <p className="text-muted-foreground">Aucun résultat ne correspond à vos critères.</p>
                            {hasActiveFilters && (
                                <Button variant="link" onClick={resetFilters} className="mt-4">
                                    Réinitialiser les filtres
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lieu</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Structure</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {donationDays.map((day: any) => (
                                        <tr key={day.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{day.title}</div>
                                                {day.description && (
                                                    <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{day.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(day.scheduledDate).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {day.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    {day.healthStructure?.name ?? "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(day.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {day.status !== "CANCELLED" && day.status !== "COMPLETED" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSuspendClick(day.id, day.title)}
                                                        disabled={suspendMutation.isPending}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
                                                    >
                                                        <Ban className="h-4 w-4 mr-2" />
                                                        Suspendre
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <Dialog 
                    open={confirmDialog.isOpen} 
                    onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, dayId: null, dayTitle: null })}
                >
                    <DialogContent>
                        <DialogHeader>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <DialogTitle className="text-center text-xl">Confirmer la suspension</DialogTitle>
                            <DialogDescription className="text-center pt-2">
                                <span className="block">Êtes-vous sûr de vouloir suspendre cette journée de don ?</span>
                                <span className="block font-semibold text-foreground mt-2">"{confirmDialog.dayTitle}"</span>
                                <span className="block text-sm text-red-600 dark:text-red-400 mt-4">⚠️ Cette action est irréversible</span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-3 sm:justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmDialog({ isOpen: false, dayId: null, dayTitle: null })}
                                disabled={suspendMutation.isPending}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmSuspend}
                                disabled={suspendMutation.isPending}
                            >
                                {suspendMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Suspension...
                                    </>
                                ) : (
                                    <>
                                        <Ban className="h-4 w-4 mr-2" />
                                        Confirmer
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}