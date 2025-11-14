// Validation utility functions
export const validateCourseForm = (formData) => {
  const errors = {};
  
  // Course title validation
  if (!formData.courseTitle || formData.courseTitle.trim().length === 0) {
    errors.courseTitle = 'Course title is required';
  } else if (formData.courseTitle.trim().length < 5) {
    errors.courseTitle = 'Course title must be at least 5 characters long';
  } else if (formData.courseTitle.trim().length > 100) {
    errors.courseTitle = 'Course title must not exceed 100 characters';
  }
  
  // Course description validation
  if (!formData.courseDescription || formData.courseDescription.trim().length === 0) {
    errors.courseDescription = 'Course description is required';
  } else if (formData.courseDescription.trim().length < 20) {
    errors.courseDescription = 'Course description must be at least 20 characters long';
  } else if (formData.courseDescription.trim().length > 5000) {
    errors.courseDescription = 'Course description must not exceed 5000 characters';
  }
  
  // Course price validation
  if (formData.coursePrice === undefined || formData.coursePrice === null) {
    errors.coursePrice = 'Course price is required';
  } else if (isNaN(formData.coursePrice) || formData.coursePrice < 0) {
    errors.coursePrice = 'Course price must be a valid positive number';
  } else if (formData.coursePrice > 10000) {
    errors.coursePrice = 'Course price cannot exceed $10,000';
  }
  
  // Discount validation
  if (formData.discount === undefined || formData.discount === null) {
    errors.discount = 'Discount is required (use 0 for no discount)';
  } else if (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100) {
    errors.discount = 'Discount must be between 0 and 100 percent';
  }
  
  // Thumbnail validation
  if (!formData.image) {
    errors.image = 'Course thumbnail is required';
  } else if (formData.image.size > 5 * 1024 * 1024) { // 5MB limit
    errors.image = 'Thumbnail file size must not exceed 5MB';
  } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(formData.image.type)) {
    errors.image = 'Thumbnail must be a valid image file (JPEG, JPG, PNG, or WebP)';
  }
  
  // Chapters validation
  if (!formData.chapters || formData.chapters.length === 0) {
    errors.chapters = 'At least one chapter is required';
  } else {
    // Validate each chapter
    formData.chapters.forEach((chapter, chapterIndex) => {
      const chapterErrors = {};
      
      // Chapter title validation
      if (!chapter.chapterTitle || chapter.chapterTitle.trim().length === 0) {
        chapterErrors.title = 'Chapter title is required';
      } else if (chapter.chapterTitle.trim().length < 3) {
        chapterErrors.title = 'Chapter title must be at least 3 characters long';
      }
      
      // Chapter content validation
      if (!chapter.chapterContent || chapter.chapterContent.length === 0) {
        chapterErrors.content = 'Each chapter must have at least one lecture';
      } else {
        // Validate each lecture
        const lectureErrors = [];
        chapter.chapterContent.forEach((lecture, lectureIndex) => {
          const lectureError = {};
          
          // Lecture title validation
          if (!lecture.lectureTitle || lecture.lectureTitle.trim().length === 0) {
            lectureError.title = 'Lecture title is required';
          } else if (lecture.lectureTitle.trim().length < 3) {
            lectureError.title = 'Lecture title must be at least 3 characters long';
          }
          
          // Lecture duration validation
          if (!lecture.lectureDuration || isNaN(lecture.lectureDuration) || lecture.lectureDuration <= 0) {
            lectureError.duration = 'Valid lecture duration is required (in minutes)';
          } else if (lecture.lectureDuration > 480) { // 8 hours max
            lectureError.duration = 'Lecture duration cannot exceed 480 minutes (8 hours)';
          }
          
          // Lecture URL validation
          if (!lecture.lectureUrl || lecture.lectureUrl.trim().length === 0) {
            lectureError.url = 'Lecture video URL is required';
          } else if (!isValidUrl(lecture.lectureUrl)) {
            lectureError.url = 'Please provide a valid video URL';
          }
          
          if (Object.keys(lectureError).length > 0) {
            lectureErrors[lectureIndex] = lectureError;
          }
        });
        
        if (lectureErrors.length > 0) {
          chapterErrors.lectures = lectureErrors;
        }
      }
      
      if (Object.keys(chapterErrors).length > 0) {
        if (!errors.chapters) errors.chapters = {};
        errors.chapters[chapterIndex] = chapterErrors;
      }
    });
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function to validate URLs
export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Validate lecture form data
export const validateLectureForm = (lectureData) => {
  const errors = {};
  
  if (!lectureData.lectureTitle || lectureData.lectureTitle.trim().length === 0) {
    errors.lectureTitle = 'Lecture title is required';
  } else if (lectureData.lectureTitle.trim().length < 3) {
    errors.lectureTitle = 'Lecture title must be at least 3 characters long';
  } else if (lectureData.lectureTitle.trim().length > 100) {
    errors.lectureTitle = 'Lecture title must not exceed 100 characters';
  }
  
  if (!lectureData.lectureDuration || isNaN(lectureData.lectureDuration) || lectureData.lectureDuration <= 0) {
    errors.lectureDuration = 'Valid lecture duration is required (in minutes)';
  } else if (lectureData.lectureDuration > 480) {
    errors.lectureDuration = 'Lecture duration cannot exceed 480 minutes (8 hours)';
  }
  
  if (!lectureData.lectureUrl || lectureData.lectureUrl.trim().length === 0) {
    errors.lectureUrl = 'Lecture video URL is required';
  } else if (!isValidUrl(lectureData.lectureUrl)) {
    errors.lectureUrl = 'Please provide a valid video URL';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate educator application form data
export const validateApplyForm = (data) => {
  const errors = {};

  if (!data.bio || !data.bio.trim()) {
    errors.bio = 'Please provide a short bio';
  }

  // At least one of portfolio (website), cvUrl or sampleLectureUrl must be present
  const hasPortfolio = Array.isArray(data.portfolio) ? data.portfolio.length > 0 : !!data.website;
  const hasCv = !!data.cvUrl;
  const hasSample = !!data.sampleLectureUrl || !!data.sampleCourseLink;

  if (!hasPortfolio && !hasCv && !hasSample) {
    errors.missingPortfolio = 'Please provide at least one portfolio URL, CV link, or a sample lecture link';
  }

  // If website provided, validate URL
  if (data.website) {
    if (!isValidUrl(data.website)) errors.website = 'Please provide a valid website URL';
  }

  if (data.sampleCourseLink) {
    if (!isValidUrl(data.sampleCourseLink)) errors.sampleCourseLink = 'Please provide a valid sample lecture URL';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Sanitize HTML content
export const sanitizeHtml = (html) => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '');
};