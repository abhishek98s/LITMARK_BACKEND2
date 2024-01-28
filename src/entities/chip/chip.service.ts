import knex from '../../config/knex.config'
import { ChipModel } from './chip.model';
import { chipExceptionMessages } from './constant/chipExceptionMessages';

/**
 * The function `findChipById` retrieves a chip from a database based on its ID and throws an error if
 * the chip is not found.
 * @param {number} chipId - The `chipId` parameter is a number that represents the ID of the chip you
 * want to find.
 * @returns a Promise that resolves to a ChipModel object.
 */
export const findChipById = async (chipId: number) => {
    const chip: ChipModel = await knex('chips').where('id', chipId).first();
    if (!chip) throw new Error(chipExceptionMessages.CHIP_NOTFOUND);

    return chip;
}

/**
 * The function `findAllChips` retrieves all chip models from a database using knex and returns them as
 * a promise.
 * @returns an array of ChipModel objects.
 */
export const findAllChips = async (): Promise<ChipModel[]> => {
    const chips: ChipModel[] = await knex('chips').select('*');
    if (!chips) throw new Error(chipExceptionMessages.CHIP_NOT_AVAILABLE);

    return chips;
}

/**
 * The function `addChip` inserts a new chip into the database and returns the inserted chip.
 * @param {ChipModel} chipData - The `chipData` parameter is an object of type `ChipModel` that
 * contains the data for the chip that needs to be added.
 * @returns a Promise that resolves to a ChipModel object.
 */
export const addChip = async (chipData: ChipModel) => {
    const chip: ChipModel = await knex('chips').insert(chipData);
    if (!chip) throw new Error(chipExceptionMessages.ADD_FAILED);

    return chip;
}

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
export const updateChip = async (chipData: ChipModel, chipId: number) => {
    const chip: ChipModel = await knex('chips').select('*').where('id', chipId).update(chipData);
    if (!chip) throw new Error(chipExceptionMessages.UPDATE_FAILED);

    return chip;
}

/**
 * The function removes a chip from the database based on its ID
 * @param {number} chipId - The `chipId` parameter is the unique identifier of the chip that needs to
 * be removed.
 * @returns the deleted chip.
 */
export const removeChip = async (chipId: number) => {
    const currentChip = await findChipById(chipId);
    if (!currentChip) throw new Error(chipExceptionMessages.REMOVE_FAILED)

    const chip: ChipModel = await knex('chips').select('*').where('id', chipId).del();
    if (!chip) throw new Error('Failed to delete chip')

    return chip;
}