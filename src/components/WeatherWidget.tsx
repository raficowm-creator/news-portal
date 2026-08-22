"use client";

import { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeatherWidget() {
  const [data, setData] = useState<{ city: string; temp: number; desc: string } | null>(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(() => {});
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CloudSun className="h-4 w-4" /> Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <div>
            <p className="text-2xl font-bold">{Math.round(data.temp)}°C</p>
            <p className="text-sm capitalize text-muted-foreground">
              {data.city} · {data.desc}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Set OPENWEATHER_API_KEY to show live weather.</p>
        )}
      </CardContent>
    </Card>
  );
}
