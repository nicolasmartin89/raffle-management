export interface Raffle {
  id: string
  title: string
  description: string
  prize: string
  price: number
  totalNumbers: number
  soldNumbers: number
  startDate: string
  endDate: string
  drawDate: string
  status: "active" | "upcoming" | "completed" | "cancelled"
  image?: string
  qrCode?: string
}

export interface Participant {
  id: string
  name: string
  email: string
  phone: string
  raffleId: string
  numbers: number[]
  totalPaid: number
  paymentStatus: "pending" | "completed" | "failed"
  purchaseDate: string
}

export interface Admin {
  id: string
  username: string
  email: string
  role: "admin" | "super_admin"
}

// Mock data
export const mockRaffles: Raffle[] = [
  {
    id: "1",
    title: "Moto Honda 2024",
    description: "Honda CB 160F - 0km con documentos al día, seguro por 6 meses incluido",
    prize: "Motocicleta Honda CB 160F 2024",
    price: 50,
    totalNumbers: 1000,
    soldNumbers: 847,
    startDate: "2024-01-01",
    endDate: "2024-02-28",
    drawDate: "2024-03-01",
    status: "active",
    qrCode: "QR001",
  },
  {
    id: "2",
    title: 'Smart TV 65"',
    description: "Samsung QLED 4K 65 pulgadas con garantía oficial de 2 años",
    prize: 'Smart TV Samsung QLED 65" 4K',
    price: 25,
    totalNumbers: 500,
    soldNumbers: 234,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    drawDate: "2024-03-20",
    status: "active",
    qrCode: "QR002",
  },
  {
    id: "3",
    title: "iPhone 15 Pro",
    description: "iPhone 15 Pro 256GB en color Titanio Natural, nuevo en caja sellada",
    prize: "iPhone 15 Pro 256GB Titanio Natural",
    price: 75,
    totalNumbers: 800,
    soldNumbers: 0,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    drawDate: "2024-04-20",
    status: "upcoming",
    qrCode: "QR003",
  },
]

export const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@email.com",
    phone: "+54 11 1234-5678",
    raffleId: "1",
    numbers: [123, 456, 789],
    totalPaid: 150,
    paymentStatus: "completed",
    purchaseDate: "2024-01-10",
  },
  {
    id: "2",
    name: "María González",
    email: "maria@email.com",
    phone: "+54 11 9876-5432",
    raffleId: "1",
    numbers: [100, 200],
    totalPaid: 100,
    paymentStatus: "completed",
    purchaseDate: "2024-01-12",
  },
  {
    id: "3",
    name: "Carlos López",
    email: "carlos@email.com",
    phone: "+54 11 5555-1234",
    raffleId: "2",
    numbers: [50, 75, 100, 125],
    totalPaid: 100,
    paymentStatus: "pending",
    purchaseDate: "2024-01-14",
  },
]

export const mockAdmin: Admin = {
  id: "1",
  username: "admin",
  email: "admin@bomberos.coop",
  role: "admin",
}

// Helper functions
export function getRaffleById(id: string): Raffle | undefined {
  return mockRaffles.find((raffle) => raffle.id === id)
}

export function getParticipantsByRaffle(raffleId: string): Participant[] {
  return mockParticipants.filter((participant) => participant.raffleId === raffleId)
}

export function getAvailableNumbers(raffleId: string): number[] {
  const raffle = getRaffleById(raffleId)
  if (!raffle) return []

  const soldNumbers = mockParticipants.filter((p) => p.raffleId === raffleId).flatMap((p) => p.numbers)

  const available = []
  for (let i = 1; i <= raffle.totalNumbers; i++) {
    if (!soldNumbers.includes(i)) {
      available.push(i)
    }
  }
  return available
}
