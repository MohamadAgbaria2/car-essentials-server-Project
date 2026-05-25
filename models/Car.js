import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  brand:        { type: String, default: 'Toyota' },
  model:        { type: String, default: 'Corolla' },
  year:         { type: Number, default: 2026 },
  licensePlate: { type: String, default: 'ABC-1234' },
  status: {
    engine: { type: String, enum: ['running', 'off'], default: 'off' },
    doors:  { type: String, enum: ['locked', 'unlocked'], default: 'locked' },
    lights: { type: String, enum: ['on', 'off'], default: 'off' },
    trunk:  { type: String, enum: ['open', 'closed'], default: 'closed' },
    ac: {
      state:       { type: String, enum: ['on', 'off'], default: 'off' },
      temperature: { type: Number, default: 22 },
      mode:        { type: String, enum: ['cool', 'hot', 'auto'], default: 'auto' }
    }
  },
  telemetry: {
    location:        { type: String, default: 'Unknown' },
    speed:           { type: Number, default: 0 },
    engineTemp:      { type: Number, default: 0 },
    oilTemp:         { type: Number, default: 0 },
    fuelLevel:       { type: Number, default: 100, min: 0, max: 100 },
    nextService:     { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
  }
}, { timestamps: true });

export default mongoose.model('Car', carSchema);
