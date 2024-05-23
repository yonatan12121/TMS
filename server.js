const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoute = require('./routes/categoryRoutes')
const notificationRoute = require('./routes/notificationRoutes')
const setupSwagger = require('./config/swagger');
const errorHandlerMiddleware = require("./middleware/error-handler");
const { logger } = require("./middleware/logger");

dotenv.config();

connectDB();


const app = express();
app.use(logger);  // Logger middleware should be before routes

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/catagory', categoryRoute);
app.use('/api/notification',notificationRoute );



setupSwagger(app);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
