const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const { bookId } = request.params;
  const getMovieQuery = `
    SELECT
      *
    FROM
      movie
    
      `;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addmovieQuery = `
    INSERT INTO
      movie (directorId, movieName,leadActor)
    VALUES
      (

         ${directorId},
        '${movieName}',
        '${leadActor}',
      );`;

  const dbResponse = await db.run(addmovieQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});
