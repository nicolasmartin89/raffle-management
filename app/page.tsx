import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket, Users, Trophy, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cooperativa de Bomberos</h1>
                <p className="text-sm text-gray-600">Sistema de Rifas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/login">
                <Button variant="outline">Administrador</Button>
              </Link>
              <Link href="/rifas">
                <Button>Ver Rifas</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Participa en Nuestras Rifas</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Apoya a la Cooperativa de Bomberos participando en nuestras rifas. Cada compra ayuda a mantener nuestros
            servicios de emergencia.
          </p>
          <Link href="/rifas">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Ticket className="mr-2 h-5 w-5" />
              Ver Rifas Disponibles
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-red-600" />
                  Rifas Activas
                </CardTitle>
                <CardDescription>Participa en rifas con premios increíbles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-sm text-gray-600">rifas disponibles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-600" />
                  Participantes
                </CardTitle>
                <CardDescription>Únete a nuestra comunidad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">1,247</p>
                <p className="text-sm text-gray-600">participantes activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-red-600" />
                  Premios Entregados
                </CardTitle>
                <CardDescription>Ganadores satisfechos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">89</p>
                <p className="text-sm text-gray-600">premios entregados</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Raffles Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Rifas Destacadas</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Moto Honda 2024</CardTitle>
                  <Badge variant="secondary">Activa</Badge>
                </div>
                <CardDescription>Honda CB 160F - 0km con documentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Precio por número:</span>
                    <span className="font-semibold">$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Números vendidos:</span>
                    <span className="font-semibold">847/1000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: "84.7%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Smart TV 65"</CardTitle>
                  <Badge variant="secondary">Activa</Badge>
                </div>
                <CardDescription>Samsung QLED 4K con garantía</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Precio por número:</span>
                    <span className="font-semibold">$25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Números vendidos:</span>
                    <span className="font-semibold">234/500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: "46.8%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">iPhone 15 Pro</CardTitle>
                  <Badge variant="outline">Próximamente</Badge>
                </div>
                <CardDescription>256GB - Titanio Natural</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Precio por número:</span>
                    <span className="font-semibold">$75</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inicio:</span>
                    <span className="font-semibold">15 Enero</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="font-bold">Cooperativa de Bomberos</span>
              </div>
              <p className="text-gray-400">Sirviendo a la comunidad con dedicación y compromiso desde 1985.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/rifas" className="hover:text-white">
                    Rifas Activas
                  </Link>
                </li>
                <li>
                  <Link href="/ganadores" className="hover:text-white">
                    Ganadores
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="text-gray-400 space-y-2">
                <p>📞 (011) 4567-8900</p>
                <p>📧 rifas@bomberos.coop</p>
                <p>📍 Av. Principal 123, Ciudad</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cooperativa de Bomberos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
