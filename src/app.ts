// package imports
import cors from 'cors';
import routes from './routes';
import passport from 'passport';
import express, { Response } from 'express';
import { jwtStrategy } from './config/passport';

// custom imports
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './helpers/ApiError';

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());
// app.use(mongoSanitize());

// gzip compression
// app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// api routes
app.use(routes);

// send back a 404 error for any unknown api request
app.use((_, __: Response, next) => {
    next(new ApiError(404, 'Not found'));
});

// error middlewares
app.use(errorConverter);

app.use(errorHandler);

export { app };