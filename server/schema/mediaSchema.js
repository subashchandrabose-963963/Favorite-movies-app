const { z } = require('zod');

const favoriteEntrySchema = z.object({
  title: z.string().min(1),
  type: z.enum(['Movie', 'TV Show']),
  director: z.string().min(1),
  budget: z.string().min(1),
  location: z.string().min(1),
  duration: z.string().min(1),
  yearTime: z.string().min(1),
});

module.exports = { favoriteEntrySchema };
