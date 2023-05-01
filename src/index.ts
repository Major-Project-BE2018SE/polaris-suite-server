import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config/config';
import { Server, IncomingMessage, ServerResponse } from 'http';

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

// connecting to mongodb using mongoose
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});

// handling uncaught exceptions and unhandled rejections
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (server) {
    server.close();
  }
});