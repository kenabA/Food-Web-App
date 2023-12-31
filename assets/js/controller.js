import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import SearchView from "./views/searchView.js";
import ResultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";

const detailsContainer = document.querySelector("#details");
const resultsContainer = document.querySelector("#results");

async function controlRecipe() {
  try {
    const idHash = window.location.hash.slice(1);
    if (!idHash) return;
    recipeView.renderSpinner(detailsContainer);
    await model.loadRecipe(idHash);
    recipeView.render(model.state.recipe);
  } catch (err) {
    const errorMsg = "NO RECIPES FOUND!";
    recipeView.renderError(errorMsg);
  }
}

["hashchange", "load"].forEach(function (ev) {
  window.addEventListener(ev, controlRecipe);
});

async function controlSearchResult() {
  try {
    ResultsView.renderSpinner(resultsContainer);
    const query = SearchView.getQuery();
    if (!query) return;
    await model.loadSearch(query);
    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage(1));
    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    const errorMsg = "NO RECIPES FOUND!";
    ResultsView.renderError(errorMsg);
  }
}

function controlPagination(page) {
  // ResultsView.render(model.state.search.results);
  ResultsView.render(model.getSearchResultsPage(page));
  // render initial pagination buttons
  paginationView.render(model.state.search);
  console.log(page);
}

const controlServings = function (newServings) {
  // Update the recipe servings ( in state )
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.render(model.state.recipe);
};

function controlAddBookmark() {
  //Add / Remove Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update Recipe View
  recipeView.render(model.state.recipe);

  // Render Bookmarks
  console.log("HELLO");
  console.log(model.state.bookmarks);
  bookmarksView.render(model.state.bookmarks);
}

const init = function () {
  SearchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
};
init();
