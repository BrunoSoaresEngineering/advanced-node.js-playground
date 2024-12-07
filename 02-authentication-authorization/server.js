const express = require('express');
const cors = require('cors');
const { logger } = require('./middleware/log-events');
const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const employeesApi = require('./routes/api/employees');
const refreshRoute = require('./routes/refresh');
const logoutRoute = require('./routes/logout');
const authMiddleware = require('./middleware/authentication');
const cookieParser = require('cookie-parser');
const { corsOptions } = require('./config/cors');
const credentials = require('./middleware/credentials');

const PORT = 3500;

const app = express();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);

app.use(authMiddleware);
app.use('/employees', employeesApi);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));