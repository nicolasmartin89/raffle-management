"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Trophy,
} from "lucide-react";
import { mockRaffles, mockParticipants } from "@/lib/mock-data";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedRaffle, setSelectedRaffle] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("[v0] Error loading reports data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate metrics
  const totalRaffles = mockRaffles.length;
  const activeRaffles = mockRaffles.filter((r) => r.status === "active").length;
  const completedRaffles = mockRaffles.filter(
    (r) => r.status === "completed"
  ).length;
  const totalParticipants = mockParticipants.length;
  const totalRevenue = mockParticipants
    .filter((p) => p.paymentStatus === "completed")
    .reduce((sum, p) => sum + p.totalPaid, 0);
  const pendingRevenue = mockParticipants
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + p.totalPaid, 0);

  // Calculate raffle performance
  const rafflePerformance = mockRaffles.map((raffle) => {
    const participants = mockParticipants.filter(
      (p) => p.raffleId === raffle.id
    );
    const revenue = participants
      .filter((p) => p.paymentStatus === "completed")
      .reduce((sum, p) => sum + p.totalPaid, 0);
    const pending = participants
      .filter((p) => p.paymentStatus === "pending")
      .reduce((sum, p) => sum + p.totalPaid, 0);
    const progressPercentage = (raffle.soldNumbers / raffle.totalNumbers) * 100;

    return {
      ...raffle,
      participantCount: participants.length,
      revenue,
      pending,
      progressPercentage,
      potentialRevenue: raffle.price * raffle.totalNumbers,
    };
  });

  // Top performing raffles
  const topRaffles = [...rafflePerformance]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  // Monthly data (simulated)
  const monthlyData = [
    { month: "Enero", raffles: 2, participants: 45, revenue: 2250 },
    { month: "Febrero", raffles: 1, participants: 28, revenue: 1400 },
    { month: "Marzo", raffles: 3, participants: 67, revenue: 3350 },
    { month: "Abril", raffles: 2, participants: 52, revenue: 2600 },
    { month: "Mayo", raffles: 1, participants: 31, revenue: 1550 },
    { month: "Junio", raffles: 2, participants: 48, revenue: 2400 },
  ];

  const exportReport = (type: string) => {
    let csvContent = "";
    let filename = "";

    switch (type) {
      case "general":
        csvContent = [
          "Métrica,Valor",
          `Total de Rifas,${totalRaffles}`,
          `Rifas Activas,${activeRaffles}`,
          `Rifas Completadas,${completedRaffles}`,
          `Total Participantes,${totalParticipants}`,
          `Ingresos Totales,${totalRevenue}`,
          `Ingresos Pendientes,${pendingRevenue}`,
        ].join("\n");
        filename = "reporte-general";
        break;

      case "raffles":
        csvContent = [
          "Rifa,Estado,Participantes,Números Vendidos,Total Números,Progreso %,Ingresos,Pendiente,Potencial",
          ...rafflePerformance.map((r) =>
            [
              r.title,
              r.status,
              r.participantCount,
              r.soldNumbers,
              r.totalNumbers,
              r.progressPercentage.toFixed(1),
              r.revenue,
              r.pending,
              r.potentialRevenue,
            ].join(",")
          ),
        ].join("\n");
        filename = "reporte-rifas";
        break;

      case "monthly":
        csvContent = [
          "Mes,Rifas,Participantes,Ingresos",
          ...monthlyData.map((m) =>
            [m.month, m.raffles, m.participants, m.revenue].join(",")
          ),
        ].join("\n");
        filename = "reporte-mensual";
        break;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800">Próximamente</Badge>
        );
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completada</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Reportes y Analytics
                </h1>
                <p className="text-sm text-gray-600">
                  Análisis detallado del rendimiento de las rifas
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el tiempo</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                +${pendingRevenue.toLocaleString()} pendiente
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
                En {totalRaffles} rifas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rifas Activas
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRaffles}</div>
              <p className="text-xs text-muted-foreground">
                {completedRaffles} completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio por Rifa
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {totalRaffles > 0
                  ? (totalRevenue / totalRaffles).toFixed(0)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Ingresos promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="raffles">Por Rifa</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Top 3 Rifas por Ingresos</CardTitle>
                    <Button
                      onClick={() => exportReport("general")}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topRaffles.map((raffle, index) => (
                      <div
                        key={raffle.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <Link
                              href={`/admin/rifas/${raffle.id}`}
                              className="font-medium text-red-600 hover:text-red-700 hover:underline"
                            >
                              {raffle.title}
                            </Link>
                            <p className="text-sm text-gray-600">
                              {raffle.participantCount} participantes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ${raffle.revenue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {raffle.progressPercentage.toFixed(1)}% vendido
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Estados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Rifas Activas</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{activeRaffles}</div>
                        <div className="text-sm text-gray-600">
                          {totalRaffles > 0
                            ? ((activeRaffles / totalRaffles) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Próximamente</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {
                            mockRaffles.filter((r) => r.status === "upcoming")
                              .length
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          {totalRaffles > 0
                            ? (
                                (mockRaffles.filter(
                                  (r) => r.status === "upcoming"
                                ).length /
                                  totalRaffles) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span>Completadas</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{completedRaffles}</div>
                        <div className="text-sm text-gray-600">
                          {totalRaffles > 0
                            ? ((completedRaffles / totalRaffles) * 100).toFixed(
                                1
                              )
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="raffles">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Rendimiento por Rifa</CardTitle>
                    <CardDescription>
                      Análisis detallado de cada rifa
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportReport("raffles")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rifa</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead>Participantes</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Potencial</TableHead>
                        <TableHead>Eficiencia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rafflePerformance.map((raffle) => (
                        <TableRow key={raffle.id}>
                          <TableCell>
                            <Link
                              href={`/admin/rifas/${raffle.id}`}
                              className="font-medium text-red-600 hover:text-red-700 hover:underline"
                            >
                              {raffle.title}
                            </Link>
                          </TableCell>
                          <TableCell>{getStatusBadge(raffle.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-red-600 h-2 rounded-full"
                                  style={{
                                    width: `${raffle.progressPercentage}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm">
                                {raffle.progressPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{raffle.participantCount}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                ${raffle.revenue.toLocaleString()}
                              </div>
                              {raffle.pending > 0 && (
                                <div className="text-sm text-yellow-600">
                                  +${raffle.pending.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            ${raffle.potentialRevenue.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {raffle.potentialRevenue > 0
                                ? (
                                    (raffle.revenue / raffle.potentialRevenue) *
                                    100
                                  ).toFixed(1)
                                : 0}
                              %
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Tendencia Mensual</CardTitle>
                    <Button
                      onClick={() => exportReport("monthly")}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month) => (
                      <div
                        key={month.month}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{month.month}</div>
                          <div className="text-sm text-gray-600">
                            {month.raffles} rifas
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ${month.revenue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {month.participants} participantes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Crecimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Promedio mensual de rifas:</span>
                      <span className="font-bold">
                        {(
                          monthlyData.reduce((sum, m) => sum + m.raffles, 0) /
                          monthlyData.length
                        ).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Promedio mensual de participantes:</span>
                      <span className="font-bold">
                        {Math.round(
                          monthlyData.reduce(
                            (sum, m) => sum + m.participants,
                            0
                          ) / monthlyData.length
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Promedio mensual de ingresos:</span>
                      <span className="font-bold">
                        $
                        {Math.round(
                          monthlyData.reduce((sum, m) => sum + m.revenue, 0) /
                            monthlyData.length
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mejor mes:</span>
                      <span className="font-bold">
                        {
                          monthlyData.reduce((best, current) =>
                            current.revenue > best.revenue ? current : best
                          ).month
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Conversión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Tasa de conversión promedio:</span>
                      <span className="font-bold">
                        {rafflePerformance.length > 0
                          ? (
                              rafflePerformance.reduce(
                                (sum, r) => sum + r.progressPercentage,
                                0
                              ) / rafflePerformance.length
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mejor conversión:</span>
                      <span className="font-bold">
                        {rafflePerformance.length > 0
                          ? Math.max(
                              ...rafflePerformance.map(
                                (r) => r.progressPercentage
                              )
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Participantes por rifa:</span>
                      <span className="font-bold">
                        {rafflePerformance.length > 0
                          ? Math.round(
                              rafflePerformance.reduce(
                                (sum, r) => sum + r.participantCount,
                                0
                              ) / rafflePerformance.length
                            )
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ticket promedio:</span>
                      <span className="font-bold">
                        $
                        {totalParticipants > 0
                          ? (totalRevenue / totalParticipants).toFixed(0)
                          : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recomendaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">
                        Optimización de Precios
                      </div>
                      <div className="text-blue-700">
                        Las rifas con precios entre $25-$50 muestran mejor
                        conversión
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">
                        Timing Óptimo
                      </div>
                      <div className="text-green-700">
                        Los sorteos de 30-45 días tienen mejor participación
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-800">
                        Seguimiento
                      </div>
                      <div className="text-yellow-700">
                        {pendingRevenue > 0 &&
                          `$${pendingRevenue.toLocaleString()} en pagos pendientes requieren seguimiento`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
