"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  QrCode,
  ShoppingCart,
} from "lucide-react";
import { getRaffleById, getAvailableNumbers } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function RaffleDetailPage() {
  const params = useParams();
  const raffleId = params.id as string;
  const raffle = getRaffleById(raffleId);
  const availableNumbers = getAvailableNumbers(raffleId);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [participantData, setParticipantData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [showPayment, setShowPayment] = useState(false);

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Rifa no encontrada</CardTitle>
            <CardDescription>
              La rifa que buscas no existe o ha sido eliminada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/rifas">
              <Button>Volver a Rifas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (raffle.soldNumbers / raffle.totalNumbers) * 100;
  const total = selectedNumbers.length * raffle.price;

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length < 10) {
      // Límite de 10 números por compra
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleRandomSelection = (count: number) => {
    const shuffled = [...availableNumbers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    setSelectedNumbers(selected);
  };

  const handlePurchase = () => {
    if (
      selectedNumbers.length > 0 &&
      participantData.name &&
      participantData.email &&
      participantData.phone
    ) {
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/rifas">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Rifas
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {raffle.title}
              </h1>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {raffle.status === "active" ? "Activa" : "Próximamente"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Raffle Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{raffle.prize}</CardTitle>
                <CardDescription className="text-base">
                  {raffle.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">${raffle.price}</p>
                      <p className="text-sm text-gray-600">por número</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">{raffle.soldNumbers}</p>
                      <p className="text-sm text-gray-600">números vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-lg font-bold">
                        {new Date(raffle.drawDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">fecha del sorteo</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Progreso de ventas
                    </span>
                    <span className="text-sm text-gray-600">
                      {raffle.soldNumbers}/{raffle.totalNumbers} (
                      {progress.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Number Selection */}
            {raffle.status === "active" && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona tus números</CardTitle>
                  <CardDescription>
                    Puedes seleccionar hasta 10 números. Haz clic en los números
                    disponibles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRandomSelection(1)}
                    >
                      1 al azar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRandomSelection(3)}
                    >
                      3 al azar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRandomSelection(5)}
                    >
                      5 al azar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNumbers([])}
                    >
                      Limpiar
                    </Button>
                  </div>

                  <div className="grid grid-cols-10 gap-1 max-h-96 overflow-y-auto p-2 border rounded-lg">
                    {Array.from(
                      { length: raffle.totalNumbers },
                      (_, i) => i + 1
                    ).map((number) => {
                      const isAvailable = availableNumbers.includes(number);
                      const isSelected = selectedNumbers.includes(number);

                      return (
                        <button
                          key={number}
                          onClick={() =>
                            isAvailable && handleNumberSelect(number)
                          }
                          disabled={!isAvailable}
                          className={`
                            p-2 text-xs font-medium rounded transition-colors
                            ${
                              isSelected
                                ? "bg-red-600 text-white"
                                : isAvailable
                                ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }
                          `}
                        >
                          {number}
                        </button>
                      );
                    })}
                  </div>

                  {selectedNumbers.length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">
                        Números seleccionados:
                      </h4>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {selectedNumbers
                          .sort((a, b) => a - b)
                          .map((number) => (
                            <Badge key={number} className="bg-red-600">
                              {number}
                            </Badge>
                          ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-900">
                          {selectedNumbers.length} número
                          {selectedNumbers.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xl font-bold text-red-900">
                          Total: ${total}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Purchase Form */}
          <div className="space-y-6">
            {raffle.status === "active" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Datos del Participante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={participantData.name}
                      onChange={(e) =>
                        setParticipantData({
                          ...participantData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={participantData.email}
                      onChange={(e) =>
                        setParticipantData({
                          ...participantData,
                          email: e.target.value,
                        })
                      }
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={participantData.phone}
                      onChange={(e) =>
                        setParticipantData({
                          ...participantData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+54 11 1234-5678"
                    />
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handlePurchase}
                    disabled={
                      selectedNumbers.length === 0 ||
                      !participantData.name ||
                      !participantData.email ||
                      !participantData.phone
                    }
                  >
                    Comprar por ${total}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Código QR
                </CardTitle>
                <CardDescription>
                  Escanea para acceder rápidamente a esta rifa
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  QR: {raffle.qrCode}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Procesar Pago</CardTitle>
                <CardDescription>
                  Serás redirigido a Mercado Pago para completar el pago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de compra:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Rifa:</span>
                      <span>{raffle.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Números:</span>
                      <span>{selectedNumbers.length}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPayment(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // Aquí iría la integración con Mercado Pago
                      alert("Redirigiendo a Mercado Pago...");
                    }}
                  >
                    Pagar con MP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
