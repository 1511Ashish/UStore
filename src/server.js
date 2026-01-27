require('dotenv').config();
const app = require('./app');
const { connectDb } = require('./config/db');

const port = process.env.PORT || "4000";

(async () => {
  try {
    await connectDb();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
