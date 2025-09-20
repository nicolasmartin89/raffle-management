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
import { Input } from "@/components/ui/input";
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
import {
  ArrowLeft,
  Search,
  Download,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { mockParticipants, mockRaffles } from "@/lib/mock-data";
import type { Participant } from "@/lib/mock-data";

export default function ParticipantsManagementPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [raffleFilter, setRaffleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setParticipants(mockParticipants);
      } catch (error) {
        console.error("[v0] Error loading participants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParticipants();
  }, []);

  useEffect(() => {
    let filtered = participants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (participant) =>
          participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.phone.includes(searchTerm)
      );
    }

    // Filter by payment status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (participant) => participant.paymentStatus === statusFilter
      );
    }

    // Filter by raffle
    if (raffleFilter !== "all") {
      filtered = filtered.filter(
        (participant) => participant.raffleId === raffleFilter
      );
    }

    setFilteredParticipants(filtered);
  }, [participants, searchTerm, statusFilter, raffleFilter]);

  const exportParticipants = () => {
    const csvContent = [
      "Nombre,Email,Teléfono,Rifa,Números,Total Pagado,Estado de Pago,Fecha de Compra",
      ...filteredParticipants.map((p) => {
        const raffle = mockRaffles.find((r) => r.id === p.raffleId);
        return [
          p.name,
          p.email,
          p.phone,
          raffle?.title || "Rifa no encontrada",
          p.numbers.join(";"),
          p.totalPaid,
          p.paymentStatus,
          p.purchaseDate,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participantes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const getRaffleName = (raffleId: string) => {
    const raffle = mockRaffles.find((r) => r.id === raffleId);
    return raffle?.title || "Rifa no encontrada";
  };

  const totalParticipants = participants.length;
  const completedPayments = participants.filter(
    (p) => p.paymentStatus === "completed"
  ).length;
  const pendingPayments = participants.filter(
    (p) => p.paymentStatus === "pending"
  ).length;
  const totalRevenue = participants
    .filter((p) => p.paymentStatus === "completed")
    .reduce((sum, p) => sum + p.totalPaid, 0);
  const pendingRevenue = participants
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + p.totalPaid, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando participantes...</p>
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
                  Gestión de Participantes
                </h1>
                <p className="text-sm text-gray-600">
                  Administrar todos los participantes de las rifas
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportParticipants} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                En todas las rifas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos Completados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedPayments}</div>
              <p className="text-xs text-muted-foreground">
                {totalParticipants > 0
                  ? ((completedPayments / totalParticipants) * 100).toFixed(1)
                  : 0}
                % del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos Pendientes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Requieren seguimiento
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
                ${pendingRevenue.toLocaleString()} pendiente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lista de Participantes</CardTitle>
                <CardDescription>
                  {filteredParticipants.length} de {totalParticipants}{" "}
                  participantes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Pagado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={raffleFilter} onValueChange={setRaffleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rifa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las rifas</SelectItem>
                  {mockRaffles.map((raffle) => (
                    <SelectItem key={raffle.id} value={raffle.id}>
                      {raffle.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participante</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Rifa</TableHead>
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
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm ||
                        statusFilter !== "all" ||
                        raffleFilter !== "all"
                          ? "No se encontraron participantes con los filtros aplicados"
                          : "No hay participantes registrados"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="font-medium">{participant.name}</div>
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
                            <Link
                              href={`/admin/rifas/${participant.raffleId}`}
                              className="text-red-600 hover:text-red-700 hover:underline"
                            >
                              {getRaffleName(participant.raffleId)}
                            </Link>
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

        {/* Payment Status Summary */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Estado de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Pagos Completados</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {completedPayments} participantes
                    </div>
                    <div className="text-sm text-gray-600">
                      ${totalRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Pagos Pendientes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {pendingPayments} participantes
                    </div>
                    <div className="text-sm text-gray-600">
                      ${pendingRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Pagos Fallidos</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {
                        participants.filter((p) => p.paymentStatus === "failed")
                          .length
                      }{" "}
                      participantes
                    </div>
                    <div className="text-sm text-gray-600">
                      $
                      {participants
                        .filter((p) => p.paymentStatus === "failed")
                        .reduce((sum, p) => sum + p.totalPaid, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participación por Rifa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRaffles.map((raffle) => {
                  const raffleParticipants = participants.filter(
                    (p) => p.raffleId === raffle.id
                  );
                  const raffleRevenue = raffleParticipants
                    .filter((p) => p.paymentStatus === "completed")
                    .reduce((sum, p) => sum + p.totalPaid, 0);

                  return (
                    <div
                      key={raffle.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <Link
                          href={`/admin/rifas/${raffle.id}`}
                          className="font-medium text-red-600 hover:text-red-700 hover:underline"
                        >
                          {raffle.title}
                        </Link>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {raffleParticipants.length} participantes
                        </div>
                        <div className="text-sm text-gray-600">
                          ${raffleRevenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
