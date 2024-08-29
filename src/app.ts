import express from 'express';
import { createUploadHandler } from './upload/upload-handler';

export const app = express();

app.post('/upload', createUploadHandler());
