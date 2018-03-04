let { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
let { Todo } = require('./models/todo');
const fs = require('fs');

module.exports = function(app) {
  // Index HTML Page Route
  app.get('/', (req, res) => {
    const html = fs.readFileSync('./server/index.html', 'utf8');
    res.send(html);
  });
  // GET /todos
  app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
      res.send({ todos });
    }, (error) => {
      res.status(404).send();
    });
  });
  //  GET /todos/:id
  app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo});
    }, (error) => {
      res.status(404).send();
    })
  });
  // POST /todos
  app.post('/todos', (req, res) => {
    const { title, categories, content, image } = req.body;
    const todo = new Todo({
      title,
      categories,
      content,
      image
    })
    todo.save().then((doc) => {
      res.send(doc)
    }, (error) => {
      res.status(400).send();
    });
  });
  // DELETE /todos/:id
  app.delete('todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    }, (error) => {
      return res.status(400).send(error);
    });
  });
  // PATCH /todos/:id
  app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const { title, categories, content, image, completed } = req.body;
    if (completed === true) {
      completedAt = new Date().getTime();
    } else {
      completed = false;
      completedAt: null;
    }
    Todo.findByIdAndUpdate(id, {$set: {
      title,
      categories,
      content,
      image,
      completed,
      completedAt
    }}).then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      res.send({ todo });
    }, (error) => {
      res.status(400).send(error)
    });
  });
}
