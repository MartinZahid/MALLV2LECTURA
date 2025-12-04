import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")
  const serviceId = searchParams.get("serviceId")

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Get store by slug
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Define all possible time slots
    const allSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30", "18:00"
    ]

    // Check which slots are already booked
    const { data: bookedSlots, error: slotsError } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("store_id", store.id)
      .eq("appointment_date", date)
      .in("status", ["scheduled", "confirmed"])

    if (slotsError) {
      console.error("[v0] Error fetching booked slots:", slotsError)
      return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
    }

    const bookedTimes = new Set(bookedSlots.map((slot) => slot.appointment_time))

    // Map slots with availability
    const slots = allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }))

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("[v0] Error in availability route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
