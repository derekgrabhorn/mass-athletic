import express from 'express';
import dotenv from 'dotenv';

//Imported Routers
import APIRouter from './routes/api';

//Initialization
dotenv.config();
var app = express();

app.listen(process.env.PORT, () => {
    console.log(`Listening at PORT ${process.env.PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((use, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

//Routes
app.use('/api', APIRouter);

//Export express Instance
export default app;