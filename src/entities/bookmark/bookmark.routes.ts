import express from 'express';
import multer from 'multer';
import * as bookmarkController from './bookmark.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware, {
  joiQueryValidationMiddleware,
} from '../../middleware/joiValidationMiddleware';

import * as schema from './bookmark.schema';
import { routes } from '../../utils/routeConfig';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

router
  .get(routes.bookmark.recent, bookmarkController.getRecentBookmarks)
  .delete(routes.bookmark.recentById, bookmarkController.deleteRecentBookmark)
  .patch(routes.bookmark.recentById, bookmarkController.addRecentBookmark)
  .get(
    routes.bookmark.recentSort,
    joiQueryValidationMiddleware(schema.recentBookmarkSortQuerySchema),
    bookmarkController.sortRecentBookmark,
  )
  .get(
    routes.bookmark.recentFilter,
    joiQueryValidationMiddleware(schema.recentBookmarkFilterQuerySchema),
    bookmarkController.filterRecentBookmark,
  )
  .get(
    routes.bookmark.recentSearch,
    joiQueryValidationMiddleware(schema.searchRecentBookmarkQuerySchema),
    bookmarkController.searchRecentBookmark,
  );

router.get(
  routes.bookmark.search,
  joiQueryValidationMiddleware(schema.searchBookmarkByTitleQuerySchema),
  bookmarkController.searchByTitle,
);
router.get(routes.bookmark.sort, bookmarkController.getSortedData);

router
  .get(routes.bookmark.root, bookmarkController.getBookmarks)
  .get(routes.bookmark.byFolderId, bookmarkController.getBookmarksByFolderId)
  .post(
    routes.bookmark.root,
    joiValidationMiddleware(schema.bookmarkSchema),
    verifyToken,
    bookmarkController.postBookmark,
  );

router
  .patch(
    routes.bookmark.byId,
    upload.single('litmark_image'),
    verifyToken,
    bookmarkController.patchBookmark,
  )
  .delete(routes.bookmark.byId, bookmarkController.deleteBookmark);

export default router;
