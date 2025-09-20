"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { mockRaffles } from "@/lib/mock-data";

export default function NewRafflePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    price: "",
    totalNumbers: "",
    startDate: "",
    endDate: "",
    drawDate: "",
    status: "upcoming" as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "El título es requerido";
    if (!formData.description.trim())
      newErrors.description = "La descripción es requerida";
    if (!formData.prize.trim()) newErrors.prize = "El premio es requerido";
    if (!formData.price || Number.parseFloat(formData.price) <= 0)
      newErrors.price = "El precio debe ser mayor a 0";
    if (!formData.totalNumbers || Number.parseInt(formData.totalNumbers) <= 0)
      newErrors.totalNumbers = "Debe haber al menos 1 número";
    if (!formData.startDate)
      newErrors.startDate = "La fecha de inicio es requerida";
    if (!formData.endDate) newErrors.endDate = "La fecha de fin es requerida";
    if (!formData.drawDate)
      newErrors.drawDate = "La fecha del sorteo es requerida";

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      newErrors.endDate = "La fecha de fin debe ser posterior al inicio";
    }

    if (
      formData.endDate &&
      formData.drawDate &&
      formData.endDate >= formData.drawDate
    ) {
      newErrors.drawDate =
        "La fecha del sorteo debe ser posterior al fin de ventas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would be an API call
      const newRaffle = {
        id: (mockRaffles.length + 1).toString(),
        ...formData,
        price: Number.parseFloat(formData.price),
        totalNumbers: Number.parseInt(formData.totalNumbers),
        soldNumbers: 0,
        qrCode: `QR${String(mockRaffles.length + 1).padStart(3, "0")}`,
      };

      console.log("New raffle created:", newRaffle);

      // Redirect to raffle detail page
      router.push(`/admin/rifas/${newRaffle.id}`);
    } catch (error) {
      console.error("Error creating raffle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (!formData.title) {
      setErrors({ title: "Ingresa un título para previsualizar" });
      return;
    }
    // In a real app, this could open a modal or navigate to a preview page
    alert("Funcionalidad de previsualización - En desarrollo");
  };

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
                  Volver al Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nueva Rifa</h1>
                <p className="text-sm text-gray-600">
                  Crear una nueva rifa para la cooperativa
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!formData.title}
              >
                <Eye className="h-4 w-4 mr-2" />
                Previsualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Detalles principales de la rifa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título de la Rifa *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Ej: Moto Honda 2024"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe los detalles del premio, condiciones, etc."
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="prize">Premio *</Label>
                    <Input
                      id="prize"
                      value={formData.prize}
                      onChange={(e) =>
                        handleInputChange("prize", e.target.value)
                      }
                      placeholder="Ej: Motocicleta Honda CB 160F 2024"
                      className={errors.prize ? "border-red-500" : ""}
                    />
                    {errors.prize && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.prize}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Números</CardTitle>
                  <CardDescription>
                    Precio y cantidad de números disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Precio por Número ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="50.00"
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="totalNumbers">Total de Números *</Label>
                      <Input
                        id="totalNumbers"
                        type="number"
                        min="1"
                        value={formData.totalNumbers}
                        onChange={(e) =>
                          handleInputChange("totalNumbers", e.target.value)
                        }
                        placeholder="1000"
                        className={errors.totalNumbers ? "border-red-500" : ""}
                      />
                      {errors.totalNumbers && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.totalNumbers}
                        </p>
                      )}
                    </div>
                  </div>

                  {formData.price && formData.totalNumbers && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Recaudación máxima:</strong> $
                        {(
                          Number.parseFloat(formData.price || "0") *
                          Number.parseInt(formData.totalNumbers || "0")
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fechas Importantes</CardTitle>
                  <CardDescription>Cronograma de la rifa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startDate">Inicio de Ventas *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className={errors.startDate ? "border-red-500" : ""}
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="endDate">Fin de Ventas *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleInputChange("endDate", e.target.value)
                        }
                        className={errors.endDate ? "border-red-500" : ""}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="drawDate">Fecha del Sorteo *</Label>
                      <Input
                        id="drawDate"
                        type="date"
                        value={formData.drawDate}
                        onChange={(e) =>
                          handleInputChange("drawDate", e.target.value)
                        }
                        className={errors.drawDate ? "border-red-500" : ""}
                      />
                      {errors.drawDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.drawDate}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado de la Rifa</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Próximamente</SelectItem>
                      <SelectItem value="active">Activa</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.status === "upcoming"
                      ? "La rifa aparecerá como 'Próximamente' hasta la fecha de inicio"
                      : "La rifa estará disponible para compra inmediatamente"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Creando..." : "Crear Rifa"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push("/admin/dashboard")}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ayuda</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Título:</strong> Debe ser descriptivo y atractivo
                  </p>
                  <p>
                    <strong>Precio:</strong> Considera el valor del premio y la
                    cantidad de números
                  </p>
                  <p>
                    <strong>Fechas:</strong> Asegúrate de dar tiempo suficiente
                    para las ventas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
