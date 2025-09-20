"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Search,
  Users,
  DollarSign,
  Calendar,
  Trophy,
} from "lucide-react";
import {
  getRaffleById,
  getParticipantsByRaffle,
  getAvailableNumbers,
} from "@/lib/mock-data";
import type { Raffle, Participant } from "@/lib/mock-data";

export default function AdminRaffleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRaffleData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const raffleData = getRaffleById(params.id);
        if (!raffleData) {
          router.push("/admin/dashboard");
          return;
        }

        const participantsData = getParticipantsByRaffle(params.id);
        const availableNumbersData = getAvailableNumbers(params.id);

        setRaffle(raffleData);
        setParticipants(participantsData);
        setAvailableNumbers(availableNumbersData);
      } catch (error) {
        console.error("[v0] Error loading raffle data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRaffleData();
  }, [params.id, router]);

  const handleDeleteRaffle = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("[v0] Raffle deleted:", params.id);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("[v0] Error deleting raffle:", error);
    }
  };

  const exportParticipants = () => {
    // In a real app, this would generate and download a CSV/Excel file
    const csvContent = [
      "Nombre,Email,Teléfono,Números,Total Pagado,Estado de Pago,Fecha de Compra",
      ...participants.map((p) =>
        [
          p.name,
          p.email,
          p.phone,
          p.numbers.join(";"),
          p.totalPaid,
          p.paymentStatus,
          p.purchaseDate,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participantes-${raffle?.title}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.phone.includes(searchTerm)
  );

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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Fallido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la rifa...</p>
        </div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Rifa no encontrada
          </h2>
          <Link href="/admin/dashboard">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalRevenue = participants.reduce(
    (sum, p) => (p.paymentStatus === "completed" ? sum + p.totalPaid : sum),
    0
  );
  const pendingRevenue = participants.reduce(
    (sum, p) => (p.paymentStatus === "pending" ? sum + p.totalPaid : sum),
    0
  );
  const progressPercentage = (raffle.soldNumbers / raffle.totalNumbers) * 100;

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
                  {raffle.title}
                </h1>
                <p className="text-sm text-gray-600">Gestión de rifa</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/rifas/${raffle.id}/editar`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar rifa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará
                      permanentemente la rifa "{raffle.title}" y todos los datos
                      asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteRaffle}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusBadge(raffle.status)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {raffle.status === "active"
                  ? "Ventas activas"
                  : "No disponible para venta"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Números Vendidos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {raffle.soldNumbers}/{raffle.totalNumbers}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progressPercentage.toFixed(1)}% vendido
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${pendingRevenue.toLocaleString()} pendiente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sorteo</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(raffle.drawDate).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(raffle.drawDate).toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="participants">
              Participantes ({participants.length})
            </TabsTrigger>
            <TabsTrigger value="numbers">Números</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Rifa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Descripción</h4>
                    <p className="text-gray-600">{raffle.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Premio</h4>
                    <p className="text-gray-600">{raffle.prize}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Precio por Número
                    </h4>
                    <p className="text-2xl font-bold text-red-600">
                      ${raffle.price}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cronograma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Inicio de ventas:</span>
                    <span className="font-semibold">
                      {new Date(raffle.startDate).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fin de ventas:</span>
                    <span className="font-semibold">
                      {new Date(raffle.endDate).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha del sorteo:</span>
                    <span className="font-semibold">
                      {new Date(raffle.drawDate).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  {raffle.qrCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Código QR:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {raffle.qrCode}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Participantes</CardTitle>
                    <CardDescription>
                      Lista de todos los participantes en esta rifa
                    </CardDescription>
                  </div>
                  <Button onClick={exportParticipants} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participante</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Números</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParticipants.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            {searchTerm
                              ? "No se encontraron participantes"
                              : "No hay participantes aún"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParticipants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {participant.name}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{participant.email}</div>
                                <div className="text-gray-500">
                                  {participant.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {participant.numbers.join(", ")}
                                <div className="text-gray-500">
                                  ({participant.numbers.length} números)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                ${participant.totalPaid}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(participant.paymentStatus)}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                participant.purchaseDate
                              ).toLocaleDateString("es-AR")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="numbers">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Números</CardTitle>
                <CardDescription>
                  {availableNumbers.length} números disponibles de{" "}
                  {raffle.totalNumbers} totales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto">
                  {Array.from(
                    { length: raffle.totalNumbers },
                    (_, i) => i + 1
                  ).map((number) => {
                    const isAvailable = availableNumbers.includes(number);
                    return (
                      <div
                        key={number}
                        className={`
                          w-12 h-12 flex items-center justify-center text-sm font-medium rounded border
                          ${
                            isAvailable
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }
                        `}
                        title={isAvailable ? "Disponible" : "Vendido"}
                      >
                        {number}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span>Vendido</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Ingresos confirmados:</span>
                    <span className="font-bold text-green-600">
                      ${totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ingresos pendientes:</span>
                    <span className="font-bold text-yellow-600">
                      ${pendingRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ingresos potenciales:</span>
                    <span className="font-bold text-blue-600">
                      ${(raffle.price * raffle.totalNumbers).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total proyectado:</span>
                      <span className="font-bold text-lg">
                        ${(totalRevenue + pendingRevenue).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Ventas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Números vendidos:</span>
                    <span className="font-bold">{raffle.soldNumbers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Números disponibles:</span>
                    <span className="font-bold">{availableNumbers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Porcentaje vendido:</span>
                    <span className="font-bold">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Participantes únicos:</span>
                    <span className="font-bold">{participants.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Promedio por participante:</span>
                    <span className="font-bold">
                      $
                      {participants.length > 0
                        ? (totalRevenue / participants.length).toFixed(0)
                        : 0}
                    </span>
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
