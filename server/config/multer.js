import multer from 'multer'
import AppError from '../utils/AppError.js'
import { UPLOAD } from '../utils/constants.js'

/**
 * Multer upload configuration with file size limits and type filtering.
 * Only allows image files (jpeg, png, webp, gif) up to 5MB.
 */
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
  if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new AppError(
        `Invalid file type: ${file.mimetype}. Allowed types: ${UPLOAD.ALLOWED_MIME_TYPES.join(', ')}`,
        400
      ),
      false
    )
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
  },
  fileFilter,
})

export default upload
