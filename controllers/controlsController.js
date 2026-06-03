import Car from '../models/Car.js';

export const getControls = async (req, res, next) => {
  try {
    const car = await Car.findOne({ userId: req.user.id }).select('status');
    if (!car)
      return res.status(404).json({ success: false, message: 'Car not found' });

    res.json({ success: true, controls: car.status });
  } catch (err) {
    next(err);
  }
};

export const updateControl = async (req, res, next) => {
  try {
    const { control, value } = req.body;

    const allowed = ['engine', 'doors', 'lights', 'trunk', 'ac.state', 'ac.temperature', 'ac.mode'];
    if (!allowed.includes(control))
      return res.status(400).json({ success: false, message: 'Invalid control name' });

    const car = await Car.findOneAndUpdate(
      { userId: req.user.id },
      { [`status.${control}`]: value },
      { new: true, runValidators: true }
    );

    if (!car)
      return res.status(404).json({ success: false, message: 'Car not found' });

    res.json({ success: true, message: `${control} updated to ${value}`, controls: car.status });
  } catch (err) {
    next(err);
  }
};

export const resetControls = async (req, res, next) => {
  try {
    const defaultStatus = {
      engine: 'off',
      doors: 'locked',
      lights: 'off',
      trunk: 'closed',
      ac: { state: 'off', temperature: 22, mode: 'auto' }
    };

    const car = await Car.findOneAndUpdate(
      { userId: req.user.id },
      { status: defaultStatus },
      { new: true }
    );

    res.json({ success: true, message: 'All controls reset to default', controls: car.status });
  } catch (err) {
    next(err);
  }
};
