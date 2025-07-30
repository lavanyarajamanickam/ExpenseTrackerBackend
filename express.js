const express= require('express')
const mongoose=require('mongoose');
const cors=require('cors')


const app=express();
const PORT=4000;


const MONGO_URI='mongodb+srv://lavanya143064:lavanya@cluster0.qzw9lzo.mongodb.net/exp?retryWrites=true&w=majority&appName=Cluster0'
app.use(cors());
app.use(express.json());
const connectDb=async()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log('connected to MongoDB');
    }catch(err){
        console.log('Error connecting to MongoDB',err)
        process.exit(1);
    }
            }
    const expenseSchema=new mongoose.Schema({
        title:{
               type:String,
                required:true
                },
        amount:{
                type:Number,
                required:true

                }
            })
    const Expense=mongoose.model('Expense',expenseSchema);
    app.post('/expenses',async(req,res)=>{
            try{
                const{title,amount}=req.body;
                const expense=new Expense ({title,amount})
                await expense.save();
                res.status(201).json(expense);

                }
            catch(error){
                    console.error('Error saving expense',error)
                    res.status(500).json({error:'Internal server error'})
                }
            })

    app.get('/expenses', async(req,res) => {
            try{
                const expense=await Expense.find();
                res.json(expense)
               }
            catch(error){
                console.log('Error fetching expense',error)
                res.sendStatus(500).json({error:'Internal server eror'})
                }
                 });
              
    app.delete('/expenses/:id',async(req,res)=>{
            try {
                const deleteExpenses=await Expense.findByIdAndDelete(req.params.id)
                if(!deleteExpenses){
                   return res.status(404).json({error:"Expenses not found"})
                }
               res.json({message:"Delete successfully"})
                }
            catch(error){
                console.log("Error deleting expense:",error)
                res.status(500).json({error:"Failed to delete expense"})

        }
    })
    app.put
connectDb().then(()=>{
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})
})