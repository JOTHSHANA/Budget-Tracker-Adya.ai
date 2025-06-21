const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetCategoryRoutes = require("./routes/budgetCategoryRoutes");
const aiRoutes = require("./routes/aiRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/budget-category", budgetCategoryRoutes);
app.use("/api/ai", aiRoutes);


app.get('/', (req, res) => {
    res.send('API running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
