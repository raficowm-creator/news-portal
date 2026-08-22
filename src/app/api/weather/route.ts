import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY;
  const city = process.env.OPENWEATHER_CITY || "Dhaka";
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 });
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) return NextResponse.json({ error: "weather failed" }, { status: 500 });
  const data = await res.json();
  return NextResponse.json({
    city: data.name,
    temp: data.main?.temp,
    desc: data.weather?.[0]?.description,
  });
}
