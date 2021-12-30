import { v4 as uuidv4 } from 'uuid';

import HttpError from '../models/http-error.model.js';

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Eduardo Hernández',
    email: 'test@test.com',
    password: 'testers',
  },
];

/**
 * List of users
 * @param {Object} res
 */
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

/**
 * Signup user
 * @param {Object} req
 * @param {Object} res
 */
const signupUser = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 400);
  }

  const createdUser = {
    id: uuidv4(),
    name, // name: name
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

/**
 * Login user
 * @param {Object} req
 * @param {Object} res
 */
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      'Could not identify user, credentials seem to be wrong.',
      401,
    );
  }

  res.json({ message: 'Logged in!' });
};

export { getUsers, signupUser, loginUser };
