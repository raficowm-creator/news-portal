"use client";

import { useEffect, useState } from "react";
import { Cloud, Clock3, MapPin } from "lucide-react";

const weatherCode = (code: number) => {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather unavailable";
};

export default function LiveInfoBar() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState<{ temperature: number; code: number } | null>(null);

  useEffect(() => {
    const updateTime = () =>
      setTime(new Intl.DateTimeFormat("en-BD", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=22.3569&longitude=91.7832&current=temperature_2m,weather_code&timezone=Asia%2FDhaka")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.current) {
          setWeather({ temperature: data.current.temperature_2m, code: data.current.weather_code });
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="border-b bg-muted/40 text-xs">
      <div className="container mx-auto flex min-h-9 items-center justify-between gap-3 px-4 text-muted-foreground">
        <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {time || "--:--:--"}</span>
        <span className="hidden items-center gap-1.5 sm:flex"><MapPin className="h-3.5 w-3.5" /> Chattogram</span>
        <span className="flex items-center gap-1.5" aria-live="polite">
          <Cloud className="h-3.5 w-3.5" />
          {weather ? `${Math.round(weather.temperature)}°C · ${weatherCode(weather.code)}` : "Loading weather…"}
        </span>
      </div>
    </div>
  );
}
