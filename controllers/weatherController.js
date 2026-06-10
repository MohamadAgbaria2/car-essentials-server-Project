import axios from 'axios';

export const getWeather = async (req, res, next) => {
  try {
    const city = req.query.city || 'Tel Aviv';

    // Step 1: get coordinates from city name (no API key needed)
    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    if (!geoRes.data.results || geoRes.data.results.length === 0)
      return res.status(404).json({ success: false, message: 'City not found' });

    const { latitude, longitude, name, country } = geoRes.data.results[0];

    // Step 2: get weather using coordinates (no API key needed)
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
    );

    const w = weatherRes.data.current_weather;
    const windSpeed = w.windspeed;
    const temp = w.temperature;

    const drivingCondition = windSpeed > 50 || temp < 0 ? 'caution' : 'good';

    res.json({
      success: true,
      weather: {
        city: `${name}, ${country}`,
        temperature: temp,
        windSpeed,
        weatherCode: w.weathercode,
        drivingCondition,
        advice: drivingCondition === 'caution'
          ? 'Drive carefully — bad weather conditions'
          : 'Good driving conditions'
      }
    });
  } catch (err) {
    next(err);
  }
};
