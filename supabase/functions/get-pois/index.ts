// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    })
  }
  try {
    const { lat, lng } = await req.json()

    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "Missing lat/lng" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          "Access-Control-Allow-Methods": "POST, OPTIONS"
        }
      })
    }

    const YELP_API_KEY = Deno.env.get("YELP_API_KEY")

    const yelpUrl =
      `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&categories=bars,nightlife&limit=20`

    const yelpRes = await fetch(yelpUrl, {
      headers: { Authorization: `Bearer ${YELP_API_KEY}` }
    })

    const yelpData = await yelpRes.json()

    const pois = (yelpData.businesses || [])
  .filter((b: any) => b.coordinates?.latitude && b.coordinates?.longitude)
  .map((b: any) => ({
    id: b.id,
    name: b.name,
    lat: b.coordinates.latitude,
    lng: b.coordinates.longitude,
    rating: b.rating,
    category: (b.categories || []).map((c: any) => c.alias).join(","),
    address: (b.location?.display_address || []).join(", "),
    source: "yelp"
  }))

    return new Response(JSON.stringify(pois), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    })
  }
})