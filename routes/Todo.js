const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getTodos,
  addTodo,
  deleteTodo,
  editTodo,
} = require("../controllers/Todo");

router.route("/").get(auth, getTodos).post(auth, addTodo);

router.route("/:id").delete(auth, deleteTodo).patch(auth, editTodo);

module.exports = router;
