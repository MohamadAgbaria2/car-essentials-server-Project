import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes     from './routes/authRoutes.js';
import carRoutes      from './routes/carRoutes.js';
import controlsRoutes from './routes/controlsRoutes.js';
import supportRoutes  from './routes/supportRoutes.js';
import weatherRoutes  from './routes/weatherRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/car',      carRoutes);
app.use('/api/controls', controlsRoutes);
app.use('/api/support',  supportRoutes);
app.use('/api/weather',  weatherRoutes);

app.get('/', (req, res) => res.json({ message: 'Car Essentials API is running' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
