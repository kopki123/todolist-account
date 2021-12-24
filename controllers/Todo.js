const Todo = require("../model/Todo");

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ createBy: req.user.id }).sort("createdAt");

    res.status(200).json({ todos, count: todos.length });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const addTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const newTodo = await Todo.create({ title, createBy: req.user.id });

    res.status(200).json(newTodo);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete({
      _id: id,
      createBy: req.user.id,
    });

    if (!todo) {
      return res.status(400).json({ msg: `No todo with id ${id}` });
    }

    res.status(200).json({ msg: "delete the todo" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const editTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, isChecked } = req.body;

    if (title === "") {
      return res.status(400).json({ msg: "title can't be empty" });
    }

    const todo = await Todo.findByIdAndUpdate(
      { _id: id },
      { title, isChecked }
    );

    if (!todo) {
      return res.status(400).json({ msg: `No todo with id ${id}` });
    }

    res.status(200).json({ msg: "Update a todo" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = { getTodos, addTodo, deleteTodo, editTodo };
