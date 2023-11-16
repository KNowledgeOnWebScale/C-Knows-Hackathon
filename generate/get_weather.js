export function get_weather(writer, interval, reader) {
  console.log("starting get_weather", typeof interval);
  const fn = async () => {
    const resp = await fetch(
      "https://data.buienradar.nl/2.0/feed/json",
      { headers: { "Accept": "application/json" } },
    );

    const json = await resp.json();
    const measurements = json["actual"]["stationmeasurements"];

    await writer.push(JSON.stringify(json) + "\n");

    console.log("Pushed ", measurements.length, "measurements");
  };
  return () => {
    fn();
    setInterval(fn, interval || 1000);

    console.log(reader);
    reader.end();
  };
}
