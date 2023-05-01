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
      movie_name
    FROM
      movie
      order by movie_id
    
      `;
  const movie = await db.all(getMovieQuery);
  response.send(movie);
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const getoneMovieQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE 
      movie_id=${movieId};
    
      `;
  const moviel = await db.get(getoneMovieQuery);
  console.log(getoneMovieQuery);
  console.log(moviel);
  response.send(moviel);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addmovieQuery = `
    INSERT INTO
      movie (director_id, movie_name,lead_actor)
    VALUES
      (

         ${directorId},
        '${movieName}',
        '${leadActor}'
      );`;

  const dbResponse = await db.run(addmovieQuery);
  const bookId = dbResponse.lastID;
  response.send({ movieId: bookId });
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
      director_id='${directorId}',
      movie_name='${movieName}',
      lead_actor='${leadActor}'
    WHERE
      movie_id = ${movieId}
      `;
  await db.run(updateMovieQuery);
  response.send("Book Updated Successfully");
});
