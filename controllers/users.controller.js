// import { v4 as uuidv4 } from 'uuid';

import HttpError from '../models/http-error.model.js';
import { validationResult } from 'express-validator';

// Models
import User from '../models/User.schema.js';

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
const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const { name, email, password, places } = req.body;

  /* const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 400);
  }

  const createdUser = {
    id: uuidv4(),
    name, // name: name
    email,
    password,
  };

  DUMMY_USERS.push(createdUser); */
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500),
    );
  }

  if (existingUser) {
    return next(
      new HttpError('User exists already, please login instead.', 404),
    );
  }

  const newUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
    places,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500),
    );
  }

  res.status(201).json({ user: newUser });
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
