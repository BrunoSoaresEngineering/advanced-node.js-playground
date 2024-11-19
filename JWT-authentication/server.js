const express = require('express');
const { logger } = require('./middleware/log-events');
const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const employeesApi = require('./routes/api/employees');
const refreshRoute = require('./routes/refresh');
const logoutRoute = require('./routes/logout');
const authMiddleware = require('./middleware/auth');
const cookieParser = require('cookie-parser');

const PORT = 3500;

const app = express();

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);

app.use(authMiddleware);
app.use('/employees', employeesApi);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))