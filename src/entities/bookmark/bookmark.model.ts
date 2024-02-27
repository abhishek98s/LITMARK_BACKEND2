export interface BookmarkModel{
    id ?: number,
    date: Date,
    image_id: number,
    title: string,
    folder_id: number,
    chip_id: number,
    click_date?: Date,
    created_by?: string,
    updated_by?: string,
}
