import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection - added database name
mongoose.connect("mongodb+srv://noor:libraces09@cluster0.k4pqliy.mongodb.net/tododb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection failed:", err));

// Todo Schema and Model
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend running successfully!',
    timestamp: new Date().toISOString()
  });
});

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ error: "Todo text is required" });
    }
    
    const todo = new Todo({
      text: req.body.text.trim(),
      done: req.body.done || false
    });
    
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }
    
    const updated = await Todo.findByIdAndUpdate(
      id, 
      { done: req.body.done },
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json(updated);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }
    
    const deleted = await Todo.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

const PORT = 4001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
