import Car from '../models/Car.js';

export const getCar = async (req, res, next) => {
  try {
    const car = await Car.findOne({ userId: req.user.id });
    if (!car)
      return res.status(404).json({ success: false, message: 'Car not found' });

    res.json({ success: true, car });
  } catch (err) {
    next(err);
  }
};

export const updateCar = async (req, res, next) => {
  try {
    const { brand, model, year, licensePlate } = req.body;
    const car = await Car.findOneAndUpdate(
      { userId: req.user.id },
      { brand, model, year, licensePlate },
      { new: true, runValidators: true }
    );

    if (!car)
      return res.status(404).json({ success: false, message: 'Car not found' });

    res.json({ success: true, message: 'Car info updated', car });
  } catch (err) {
    next(err);
  }
};

export const updateTelemetry = async (req, res, next) => {
  try {
    const { location, speed, engineTemp, oilTemp, fuelLevel, nextService } = req.body;
    const car = await Car.findOneAndUpdate(
      { userId: req.user.id },
      { 'telemetry.location': location, 'telemetry.speed': speed,
        'telemetry.engineTemp': engineTemp, 'telemetry.oilTemp': oilTemp,
        'telemetry.fuelLevel': fuelLevel, 'telemetry.nextService': nextService },
      { new: true }
    );

    res.json({ success: true, message: 'Telemetry updated', car });
  } catch (err) {
    next(err);
  }
};

// Complex query 1: car health stats summary
export const getCarStats = async (req, res, next) => {
  try {
    const car = await Car.findOne({ userId: req.user.id });
    if (!car)
      return res.status(404).json({ success: false, message: 'Car not found' });

    const fuel = car.telemetry.fuelLevel;
    const daysToService = Math.ceil(
      (new Date(car.telemetry.nextService) - new Date()) / (1000 * 60 * 60 * 24)
    );

    const health = {
      fuelStatus:   fuel > 50 ? 'good' : fuel > 20 ? 'low' : 'critical',
      engineStatus: car.telemetry.engineTemp < 100 ? 'normal' : 'overheating',
      oilStatus:    car.telemetry.oilTemp < 90 ? 'normal' : 'high',
      serviceAlert: daysToService <= 14,
      daysToService,
      overallScore: Math.round((fuel + (car.telemetry.engineTemp < 100 ? 100 : 50) + (car.telemetry.oilTemp < 90 ? 100 : 50)) / 3)
    };

    res.json({ success: true, stats: health });
  } catch (err) {
    next(err);
  }
};
