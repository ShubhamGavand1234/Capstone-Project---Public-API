import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

let recipedata = {
  image: "",
  title: "",
  ingidents: [],
  instructions: "",
};

let cardData = {
  card_thumbnail: "",
  card_title: "",
  card_id: "",
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    // console.log(response.data.meals[0].idMeal);
    const ingidentArray = [];
    let ingrident = "";
    response.data.meals.forEach((meal) => {
      for (var i = 1; i <= 20; i++) {
        ingrident = meal[`strIngredient${i}`] + " : " + meal[`strMeasure${i}`];
        if (meal[`strIngredient${i}`] !== "" && meal[`strMeasure${i}`] !== "") {
          ingidentArray.push(ingrident);
        }
      }
    });

    //
    response.data.meals.forEach((meal) => {
      recipedata = {
        image: meal.strMealThumb,
        title: meal.strMeal,
        ingidents: ingidentArray,
        instructions: meal.strInstructions,
      };
    });
    console.log(meal.strMealThumb);
    res.render("singleRecipe.ejs", recipedata);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the recipe.");
  }
});

app.get("/home", async (req, res) => {
  const response = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood"
  );
  console.log(response.data.meals);
  res.render("home.ejs", { carddata: response.data.meals });
  // res.sendStatus(200);
});

app.get("/singlerecipefromid", async (req, res) => {
  const receipID = req.query.id; //// Get the ID from query parameters
  console.log(receipID);
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${receipID}`
    );

    // generating data
    const ingidentArray = [];
    let ingrident = "";
    response.data.meals.forEach((meal) => {
      for (var i = 1; i <= 20; i++) {
        ingrident = meal[`strIngredient${i}`] + " : " + meal[`strMeasure${i}`];
        if (meal[`strIngredient${i}`] !== "" && meal[`strMeasure${i}`] !== "") {
          ingidentArray.push(ingrident);
        }
      }
    });
    response.data.meals.forEach((meal) => {
      recipedata = {
        image: meal.strMealThumb,
        title: meal.strMeal,
        ingidents: ingidentArray,
        instructions: meal.strInstructions,
      };
    });
    console.log(recipedata.image);
    // res.sendStatus(200);

    //
    res.render("singleRecipe.ejs", recipedata);

    // res.status(200).json(response.data); // Send the response data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the recipe.");
  }
});

app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});
