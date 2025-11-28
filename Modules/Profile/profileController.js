import express, { Router } from 'express'
import { getProfile, getTicket, updateProfile } from './profileService.js';
import upload from '../../utils/upload.js';

export const profileRoute=Router();

profileRoute.put('/updateProfile',upload.single('image'),updateProfile)
profileRoute.get('/getProfile',getProfile)
