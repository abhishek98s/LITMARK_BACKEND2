export interface BookmarkModel {
    id?: number,
    image_id: number,
    url: string,
    title: string,
    folder_id: number,
    chip_id: number,
    user_id: number,
    date: Date,
    click_date?: Date,
    created_by?: string,
    updated_by?: string,
}
