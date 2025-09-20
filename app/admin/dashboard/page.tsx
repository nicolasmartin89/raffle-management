"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Plus,
  Ticket,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { mockRaffles, mockParticipants } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return <div>Cargando...</div>;
  }

  const totalRevenue = mockParticipants
    .filter((p) => p.paymentStatus === "completed")
    .reduce((sum, p) => sum + p.totalPaid, 0);

  const totalParticipants = mockParticipants.length;
  const activeRaffles = mockRaffles.filter((r) => r.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600">Cooperativa de Bomberos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver sitio
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rifas Activas
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRaffles}</div>
              <p className="text-xs text-muted-foreground">
                +1 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Participantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Conversión
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Rifas</h2>
          <div className="flex gap-2">
            <Link href="/admin/participantes">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Participantes
              </Button>
            </Link>
            <Link href="/admin/reportes">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Reportes
              </Button>
            </Link>
            <Link href="/admin/rifas/nueva">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Rifa
              </Button>
            </Link>
          </div>
        </div>

        {/* Raffles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rifas</CardTitle>
            <CardDescription>
              Gestiona todas las rifas de la cooperativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRaffles.map((raffle) => {
                const progress =
                  (raffle.soldNumbers / raffle.totalNumbers) * 100;
                const participants = mockParticipants.filter(
                  (p) => p.raffleId === raffle.id
                );
                const revenue = participants
                  .filter((p) => p.paymentStatus === "completed")
                  .reduce((sum, p) => sum + p.totalPaid, 0);

                return (
                  <div key={raffle.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {raffle.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {raffle.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            raffle.status === "active"
                              ? "bg-green-100 text-green-800"
                              : raffle.status === "upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {raffle.status === "active"
                            ? "Activa"
                            : raffle.status === "upcoming"
                            ? "Próximamente"
                            : "Completada"}
                        </Badge>
                        <div className="flex gap-1">
                          <Link href={`/admin/rifas/${raffle.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/rifas/${raffle.id}/editar`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">
                          ${raffle.price}
                        </p>
                        <p className="text-sm text-gray-600">por número</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold">
                          {raffle.soldNumbers}/{raffle.totalNumbers}
                        </p>
                        <p className="text-sm text-gray-600">
                          números vendidos
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold">
                          {participants.length}
                        </p>
                        <p className="text-sm text-gray-600">participantes</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold">
                          ${revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">recaudado</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Progreso de ventas
                        </span>
                        <span className="text-sm text-gray-600">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                      <span>
                        Sorteo: {new Date(raffle.drawDate).toLocaleDateString()}
                      </span>
                      <span>QR: {raffle.qrCode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
