import express from 'express';
import bodyParser from 'body-parser';
import router from './src/routes/taskRoute.js';
import authRouter from './src/routes/authRoute.js';
import taskRouter from './src/routes/taskRoute.js';
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(router);
app.use('/api/auth',authRouter);
app.use('/api/tasks',taskRouter);



app.listen(port, function() {
    console.log(`Server is running on port ======> ${port}`);
})