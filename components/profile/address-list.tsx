"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Trash2 } from "lucide-react"
import { AddressDialog } from "@/components/checkout/address-dialog"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserAddress } from "@/lib/types/database"

interface AddressListProps {
  addresses: UserAddress[]
}

export function AddressList({ addresses: initialAddresses }: AddressListProps) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("user_addresses").delete().eq("id", id)

      if (error) throw error

      setAddresses(addresses.filter((a) => a.id !== id))
      toast({
        title: "Dirección eliminada",
        description: "La dirección se eliminó correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la dirección",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mis Direcciones</CardTitle>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dirección
        </Button>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold text-foreground">{address.address_name}</p>
                  </div>
                  {address.is_default && <Badge variant="secondary">Predeterminada</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                </p>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(address.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No tienes direcciones guardadas</p>
        )}
      </CardContent>

      <AddressDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onAddressAdded={(address) => setAddresses([...addresses, address])}
      />
    </Card>
  )
}
