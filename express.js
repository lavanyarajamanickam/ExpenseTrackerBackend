const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT||4000;

// MongoDB connection string

const MONGO_URI = 'mongodb+srv://lavanya143064:lavanya143@cluster0.qzw9lzo.mongodb.net/?appName=Cluster0';
// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

// Schema
const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

// Model
const Expense = mongoose.model('Expense', expenseSchema);

// ---------------------- ROUTES ----------------------

// CREATE expense
app.post('/expenses', async (req, res) => {
    try {
        const { title, amount } = req.body;

        const expense = new Expense({ title, amount });
        await expense.save();
        res.status(201).json(expense);

    } catch (error) {
        console.error('Error saving expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ all expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);

    } catch (error) {
        console.log('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE expense
app.delete('/expenses/:id', async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Deleted successfully' });

    } catch (error) {
        console.log('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// UPDATE expense
app.put('/expenses/:id', async (req, res) => {
    try {
        const { title, amount } = req.body;

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { title, amount },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(updatedExpense);

    } catch (error) {
        console.log('Error updating expense:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

// Start server
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
