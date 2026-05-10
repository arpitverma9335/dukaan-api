import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler.js';
import { ApiRouter } from './routes/base-router.js';
import { dbInstance } from './services/db.service.js';

const app: Application = express();

app.use(cors(), express.json(), express.urlencoded({ extended: false }));

app.use('/api', ApiRouter);

app.use(errorHandler);

dbInstance.getConnectionObject()
.then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
})
.catch(err => {
    console.error(err?.message || 'Server failed to start due to DB error');
    process.exit(1);
});