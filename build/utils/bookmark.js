"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThumbnailFromURL = exports.getTitleFromURL = exports.getHostnameFromUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getHostnameFromUrl = (url) => {
    const pattern = /https?:\/\/(?:www\.)?([^/?]+)/i;
    const match = url.match(pattern);
    if (match) {
        return match[1];
    }
    else {
        return null;
    }
};
exports.getHostnameFromUrl = getHostnameFromUrl;
const getTitleFromURL = async (url) => {
    try {
        const searchAPIKey = process.env.GOOGLE_SEARCH_API_KEY;
        const searchID = process.env.GOOGLE_SEARCH_ID;
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchID}&q=${url}`);
        const data = await response.json();
        const title = data.items[0].title;
        return title;
    }
    catch (error) {
        return (0, exports.getHostnameFromUrl)(url);
    }
};
exports.getTitleFromURL = getTitleFromURL;
const getThumbnailFromURL = async (url) => {
    try {
        const searchAPIKey = process.env.GOOGLE_SEARCH_API_KEY;
        const searchID = process.env.GOOGLE_SEARCH_ID;
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchID}&q=${url}`);
        const data = await response.json();
        const thumbnail = data.items[0].pagemap.cse_thumbnail[0].src;
        return thumbnail;
    }
    catch (error) {
        const favicon = `https://www.google.com/s2/favicons?domain=${(0, exports.getHostnameFromUrl)(url)}&sz=256`;
        return favicon;
    }
};
exports.getThumbnailFromURL = getThumbnailFromURL;
