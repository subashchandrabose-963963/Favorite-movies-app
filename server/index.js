const express = require('express');
const cors = require('cors');
const app = express();
const mediaRoutes = require('./routes/mediaRoutes')
require('dotenv').config();


app.use(cors());
app.use(express.json());
app.use('/api/media', mediaRoutes);


const PORT = process.env.DOMAIN_URL || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
