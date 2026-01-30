export async function getPOIs(lat, lng) {
  const res = await fetch(
    "https://xjpeeiadavplegwrsgty.functions.supabase.co/get-pois",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng })
    }
  )

  if (!res.ok) throw new Error("Failed to fetch POIs")

  return res.json()
}