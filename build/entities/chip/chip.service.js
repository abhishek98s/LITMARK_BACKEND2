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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChip = exports.updateChip = exports.addChip = exports.findAllChips = exports.findChipById = void 0;
const ChipDAO = __importStar(require("./chip.repository"));
const chipExceptionMessages_1 = require("./constant/chipExceptionMessages");
/**
 * The function `findChipById` retrieves a chip from a database based on its ID and throws an error if
 * the chip is not found.
 * @param {number} chipId - The `chipId` parameter is a number that represents the ID of the chip you
 * want to find.
 * @returns a Promise that resolves to a ChipModel object.
 */
const findChipById = async (chipId) => {
    const chip = await ChipDAO.fetchById(chipId);
    if (!chip)
        throw new Error(chipExceptionMessages_1.chipExceptionMessages.CHIP_NOTFOUND);
    return chip;
};
exports.findChipById = findChipById;
/**
 * The function `findAllChips` retrieves all chip models from a database using knex and returns them as
 * a promise.
 * @returns an array of ChipModel objects.
 */
const findAllChips = async (user_id) => {
    const chips = await ChipDAO.fetchAll(user_id);
    if (!chips)
        throw new Error(chipExceptionMessages_1.chipExceptionMessages.CHIP_NOT_AVAILABLE);
    return chips;
};
exports.findAllChips = findAllChips;
/**
 * The function `addChip` inserts a new chip into the database and returns the inserted chip.
 * @param {ChipModel} chipData - The `chipData` parameter is an object of type `ChipModel` that
 * contains the data for the chip that needs to be added.
 * @returns a Promise that resolves to a ChipModel object.
 */
const addChip = async (chipData) => {
    const chip = await ChipDAO.create(chipData);
    if (!chip)
        throw new Error(chipExceptionMessages_1.chipExceptionMessages.ADD_FAILED);
    const [chipID] = chip;
    return await (0, exports.findChipById)(chipID);
};
exports.addChip = addChip;
/**
 * The function updates a chip record in the database with the provided data and returns the updated
 * chip.
 * @param {ChipModel} chipData - The `chipData` parameter is an object of type `ChipModel` that
 * contains the updated data for the chip. It represents the new values that will be updated in the
 * database for the chip with the specified `chipId`.
 * @param {number} chipId - The `chipId` parameter is the unique identifier of the chip that needs to
 * be updated. It is used to locate the specific chip in the database table.
 * @returns the updated chip data.
 */
const updateChip = async (chipData, chipId) => {
    const chip = await ChipDAO.update(chipData, chipId);
    if (!chip)
        throw new Error(chipExceptionMessages_1.chipExceptionMessages.UPDATE_FAILED);
    return await (0, exports.findChipById)(chipId);
};
exports.updateChip = updateChip;
/**
 * The function removes a chip from the database based on its ID
 * @param {number} chipId - The `chipId` parameter is the unique identifier of the chip that needs to
 * be removed.
 * @returns the deleted chip.
 */
const removeChip = async (chipId) => {
    const currentChip = await (0, exports.findChipById)(chipId);
    if (!currentChip)
        throw new Error(chipExceptionMessages_1.chipExceptionMessages.REMOVE_FAILED);
    const chip = await ChipDAO.remove(chipId);
    if (!chip)
        throw new Error('Failed to delete chip');
    return currentChip;
};
exports.removeChip = removeChip;
