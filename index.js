import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var noteArr = [];
var editId = -1; // id used to track which note to edit

app.get("/", (req, res) => {
  console.log(noteArr);
  if (noteArr.length > 0) {
    for (let index = 0; index < noteArr.length; index++) {
      noteArr[index].id = index;
    }
    editId = -1;
  }
  res.render("index.ejs", {
    page: "dashboard",
    noteArr: noteArr,
  });
});

app.get("/newNote", (req, res) => {
  res.render("index.ejs", {
    page: "newNote",
    noteArr: noteArr,
    id: editId,
  });
});

app.get("/imgText", (req, res) => {
  editId = -1;
  res.render("index.ejs", {
    page: "imgText",
  });
});

app.post("/submit-text", (req, res) => {
  const text = req.body.text;
  const title = req.body.title;
  const date = new Date().toDateString();
  console.log(text);
  console.log(title);
  if (noteArr[editId]) {
    noteArr[editId].title = title;
    noteArr[editId].text = text;
    noteArr[editId].date = date;
  } else {
    noteArr.push({ text: text, title: title, date: date, id: noteArr.length });
  }

  res.json({ success: true, redirectUrl: "/" });
});

app.post("/edit", (req, res) => {
  editId = parseInt(req.body.id);

  res.redirect("/newNote");
});

app.post("/delete", (req, res) => {
  const id = parseInt(req.body.id);
  console.log(req.body);
  noteArr.splice(id, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
