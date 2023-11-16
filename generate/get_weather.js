export function get_weather(writer, interval) {
  console.log("starting get_weather");
  return () => {
    setInterval(async () => {
      const resp = await fetch(
        "https://data.buienradar.nl/2.0/feed/json",
        { headers: { "Accept": "application/json" } },
      );

      const json = await resp.json();
      const measurements = json["actual"]["stationmeasurements"];

      await writer.push(JSON.stringify(measurements) + "\n");

      console.log("Pushed ", measurements.length, "measurements");
    }, interval || 1000);
  };
}
