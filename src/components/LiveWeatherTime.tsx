"use client";

import { useEffect, useState } from "react";
import { CloudSun, Clock } from "lucide-react";

export default function LiveWeatherTime() {
  const [weather, setWeather] = useState<{ city: string; temp: number; desc: string } | null>(null);
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch weather
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setWeather(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-lg border">
      {/* Time Display */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Local Time</p>
          <p className="text-lg font-bold font-mono">{time || "Loading..."}</p>
        </div>
      </div>

      {/* Weather Display */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <CloudSun className="w-5 h-5 text-blue-500" />
        <div>
          <p className="text-xs text-muted-foreground">Weather</p>
          {weather ? (
            <div>
              <p className="font-bold">{Math.round(weather.temp)}°C</p>
              <p className="text-xs text-muted-foreground capitalize">
                {weather.city} · {weather.desc}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Set OPENWEATHER_API_KEY</p>
          )}
        </div>
      </div>
    </div>
  );
}
