import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  try {
    // Vérifier la méthode
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Récupérer la session utilisateur
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Récupérer les données du corps de la requête
    const { booking_id } = await req.json()

    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'Booking ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Récupérer les détails de la réservation
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*, vehicle:vehicles(owner_id)')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Vérifier que l'utilisateur est le propriétaire du véhicule
    if (booking.vehicle.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Vérifier que le paiement est en attente de capture
    if (booking.payment_status !== 'preauthorized') {
      return new Response(JSON.stringify({ error: 'Payment cannot be captured' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Capturer le paiement
    const paymentIntent = await stripe.paymentIntents.capture(booking.payment_intent_id)

    // Mettre à jour le statut du paiement
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        payment_status: 'charged',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id)

    if (updateError) {
      throw updateError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}) 