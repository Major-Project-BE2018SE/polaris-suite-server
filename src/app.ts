import express, { Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import routes from './routes';
import { jwtStrategy } from './config/passport';
import { errorConverter, errorHandler } from './middlewares/error';

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
app.use((_, res: Response, next) => {
    next(res.status(404).send({ message: 'Not Found' }));
});

// error middlewares
app.use(errorConverter);

app.use(errorHandler);

export { app };