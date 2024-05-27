"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.updateUser = exports.addUser = exports.getUserById = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userExceptionMessages_1 = require("./constant/userExceptionMessages");
const UserDAO = __importStar(require("./user.repository"));
/**
 * The function `getUserById` retrieves a user from a database based on their ID and returns it.
 * @param {number} userId - The `userId` parameter is a number that represents the unique identifier of
 * a user.
 * @returns a Promise that resolves to a UserModel object.
 */
const getUserById = async (userId) => {
    const user = await UserDAO.fetchById(userId);
    if (!user)
        throw new Error(userExceptionMessages_1.userExceptionMessages.USER_NOT_FOUND);
    return user;
};
exports.getUserById = getUserById;
/**
 * The function `addUser` takes in user information, hashes the password, inserts the user into a
 * database, and returns the user.
 * @param {UserModel} userInfo - The `userInfo` parameter is an object of type `UserModel` which
 * contains information about the user that needs to be added. This information typically includes
 * properties such as `username`, `email`, and `password`.
 * @returns the user object that was inserted into the "users" table in the database.
 */
const addUser = async (userInfo) => {
    const { password } = userInfo;
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const user = await UserDAO.create({ ...userInfo, password: hashedPassword });
    if (!user)
        throw new Error(userExceptionMessages_1.userExceptionMessages.CREATE_FAILED);
    const [userID] = user;
    return await UserDAO.fetchById(userID);
};
exports.addUser = addUser;
/**
 * The function updates a user's information in the database and returns the updated user.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that needs to
 * be updated. It is of type `number`.
 * @param {UserModel} updatedUserInfo - The `updatedUserInfo` parameter is an object of type
 * `UserModel` that contains the updated information for the user.
 * @returns the updated user information.
 */
const updateUser = async (userId, updatedUserInfo) => {
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(updatedUserInfo.password, salt);
    const updatedUser = { ...updatedUserInfo, password: hashedPassword };
    const user = await UserDAO.update(updatedUser, userId);
    if (!user)
        throw new Error(userExceptionMessages_1.userExceptionMessages.UPDATE_FAILED);
    return await UserDAO.fetchById(userId);
};
exports.updateUser = updateUser;
/**
 * The function removes a user from the database by their ID and returns the deleted user.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that needs to
 * be removed from the database.
 * @returns the deleted user object.
 */
const removeUser = async (userId) => {
    const currentUser = await (0, exports.getUserById)(userId);
    if (!currentUser)
        throw new Error('User doesnot exist');
    const user = await UserDAO.remove(userId);
    if (!user)
        throw new Error(userExceptionMessages_1.userExceptionMessages.DELETE_FAILED);
    return currentUser;
};
exports.removeUser = removeUser;
