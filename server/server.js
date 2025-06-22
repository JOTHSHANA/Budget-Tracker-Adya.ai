const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetCategoryRoutes = require("./routes/budgetCategoryRoutes");
const aiRoutes = require("./routes/aiRoutes");
const alertRoutes = require("./routes/alertRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: 'http://budget-tracker-adyaai.netlify.app',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/budget-category", budgetCategoryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);


app.get('/', (req, res) => {
    res.send('API running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
