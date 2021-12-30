import { Router } from 'express';

// Controllers
import {
  getUsers,
  signupUser,
  loginUser,
} from '../controllers/users.controller.js';

const router = Router();

router.get('/', getUsers);
router.post('/signup', signupUser);
router.post('/login', loginUser);

export default router;
