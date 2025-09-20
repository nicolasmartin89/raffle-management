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
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import { mockRaffles } from "@/lib/mock-data";

export default function RafflesPage() {
  const activeRaffles = mockRaffles.filter(
    (raffle) => raffle.status === "active"
  );
  const upcomingRaffles = mockRaffles.filter(
    (raffle) => raffle.status === "upcoming"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Rifas Disponibles
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Raffles */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Rifas Activas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRaffles.map((raffle) => {
              const progress = (raffle.soldNumbers / raffle.totalNumbers) * 100;

              return (
                <Card
                  key={raffle.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{raffle.title}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Activa
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {raffle.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progreso</span>
                        <span className="text-sm font-medium">
                          {raffle.soldNumbers}/{raffle.totalNumbers}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>${raffle.price} por número</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          Sorteo:{" "}
                          {new Date(raffle.drawDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link href={`/rifas/${raffle.id}`}>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Participar Ahora
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Upcoming Raffles */}
        {upcomingRaffles.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Próximas Rifas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRaffles.map((raffle) => (
                <Card key={raffle.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{raffle.title}</CardTitle>
                      <Badge variant="outline">Próximamente</Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {raffle.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>${raffle.price} por número</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          Inicia:{" "}
                          {new Date(raffle.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button disabled className="w-full">
                      Disponible Pronto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
