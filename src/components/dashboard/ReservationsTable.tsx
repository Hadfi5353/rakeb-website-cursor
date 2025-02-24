
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCw } from "lucide-react";

interface Reservation {
  id: number;
  car: string;
  startDate: string;
  endDate: string;
  status: string;
  price: number;
  location: string;
}

interface ReservationsTableProps {
  reservations: Reservation[];
  onRenewal: (reservation: Reservation) => void;
}

export const ReservationsTable = ({ reservations, onRenewal }: ReservationsTableProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Réservations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.car}</TableCell>
                <TableCell>
                  {reservation.startDate} - {reservation.endDate}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reservation.status === "En cours" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>{reservation.price} Dh</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRenewal(reservation)}
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Renouveler
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
