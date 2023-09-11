import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser, logoutUser, loginUser } from "../controllers/users.controller.mjs";

const usersRouter = Router();

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUser);

usersRouter.post('/', createUser);

usersRouter.put('/:id', updateUser);

usersRouter.delete('/:id', deleteUser);

usersRouter.post('/logout', logoutUser);

usersRouter.post('/login', loginUser);

export default usersRouter;