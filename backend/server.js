const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./api/middlewares/errorMiddleware');
const { loggerContext } = require('./api/utils/logger/logger-context');
const apiRoutes = require('./api/routes/routes');

const app = express();

app.use(loggerContext);

app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  res.send('Restaurant API is running...');
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
