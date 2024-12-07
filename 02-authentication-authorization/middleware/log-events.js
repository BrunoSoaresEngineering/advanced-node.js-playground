const fs = require('fs/promises');
const path = require('path');
const { format } = require('date-fns');

async function logEvents(message, logName) {
  const logsFolder = path.join(__dirname, '..', 'logs');

  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');

  const logItem = `${dateTime}`;
  
  try {
    await fs.mkdir(logsFolder, { recursive: true });
    await fs.appendFile(path.join(logsFolder, logName), logItem);
  } catch (error) {
    console.log(error);
  }
}

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = { logger };