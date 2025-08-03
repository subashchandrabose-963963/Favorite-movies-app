const { favoriteEntrySchema } = require('../schema/mediaSchema'); 
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



router.get('/favorites', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 20;
  const skip = (page - 1) * size;

  const [total, entries] = await Promise.all([
    prisma.favoriteEntry.count(),
    prisma.favoriteEntry.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: size,
    })
  ]);

  res.json({
    page,
    size,
    total,
    entries,
  });
});




router.post('/favorites', async (req, res) => {
  const parsed = favoriteEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }
  try {
    const newEntry = await prisma.favoriteEntry.create({ data: parsed.data });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry.' });
  }
});



router.put('/favorites/:id', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = favoriteEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }
  try {
    const updated = await prisma.favoriteEntry.update({
      where: { id },
      data: parsed.data,
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Entry not found.' });
  }
});


router.delete('/favorites/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.favoriteEntry.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Entry not found.' });
  }
});


module.exports = router;