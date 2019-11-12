// Global app controller
import Search from "./modules/Search";
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from  "./views/listView";
import * as likesView from "./views/likesView"
import Recipe from './modules/Recipe';
import List from './modules/List';
import Like from './modules/Likes'

/* Global state of the app

* - Search object 
* - Current recipe object
* - Shopping list object
* - Liked recipes

*/

//Search
const state = {};



const controlSearch = async ()=>{
	// 1. Get query from UI
	const query = searchView.getInput();
	

	if(query){
		// 2. New Search object and add to the state
		state.search = new Search(query);

		// 3. Prepare UI for results

		searchView.clearInput();

		searchView.clearResults();

		renderLoader(elements.searchRes)

		// 4. Do search

		await state.search.getResults();

		// 5. Render results on UI

		clearLoader();
		searchView.renderResults(state.search.result);
		

	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	
	controlSearch();
	
});


elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	
	if(btn){
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
})


//Recipe ctrl

//const recipe = new Recipe(46956);
//recipe.getRecipe();
//console.log(recipe)

const controlRecipe = async() => {
	//Get id from URL
	const id = window.location.hash.replace('#', '');
	
	if(id){
		//Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe)
		// Highlight selected item
		if(state.search){
			searchView.highLihtedSelected(id);
		}
		


		//Create new recipe object and parseIngredeints;
		state.recipe = new Recipe(id);
		
		//Get recipe 

	 	await state.recipe.getRecipe();
	 	state.recipe.parseIngredeints();
		// Calc servings and time
		state.recipe.calcTime();
		state.recipe.calcServing();
		// Render recipe

		clearLoader();
		recipeView.renderRecipe(state.recipe,
			state.likes.isLiked(id)
			)
		
	}
}


//'load'
['hashchange'].forEach(event => window.addEventListener(event, controlRecipe));


// Handling recipe btn clicks

elements.recipe.addEventListener('click', e => {

	if(e.target.matches('.btn-decrease, .btn-decrease *')){
		// decrease btn
		if(state.recipe.serving > 1){
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
	}
		
	} else if(e.target.matches('.btn-increase, .btn-increase *')){
		// increase btn
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe)
	}
	
});
// add item to the shopping list
window.addEventListener('click', e => {
	const btn = e.target.closest('.recipe__btn')
	if(btn){
		//Prepare UI for changes

		listView.clearShopList();

		//Add item to data

		state.list = new List();

		state.recipe.ingredients.forEach(el => {

        	state.list.addItem(el.count, el.unit, el.ingredient);
        
    	});
    	
		//Render shopList
		listView.renderShopList(state.list);



		
	}

});
//Delete item from shopping list
window.addEventListener('click', e => {
	const itemDom = e.target.closest('.shopping__item');
	
	if(e.target.closest('.shopping__delete')){
		
		const btn = e.target.closest('.shopping__delete');
		if(btn){

			//delete from data
			state.list.deleteItem(itemDom.dataset.itemid);
			// delet from UI
			btn.parentNode.remove();
		}
	} else if(e.target.matches('.shopping__count-value')) {
		const id = e.target.closest('.shopping__item').dataset.itemid;
        const val = parseFloat(e.target.value, 10);
        
        console.log(val);
        state.list.updateCount(itemDom.dataset.itemid, val);
        console.log(state.list);
    }
});



/// like ctrl
const controlLike = ()  =>{
	if(!state.likes) state.likes = new Like();
	const currenId = state.recipe.id;
	//User has not yet liked current recipe
	if(!state.likes.isLiked(currenId)){
		// add like to the state
		const newLike = state.likes.addLike(
				currenId,
				state.recipe.title,
				state.recipe.author,
				state.recipe.img
			);
		// toggle the like btn
		likesView.toogleLikeBtn(true)


		// add like to UI

		likesView.renderLike(newLike)

	//user has liked recipe
	} else {

		//Remove like from Ui
		state.likes.deleteLike(currenId);
		//Toggle the like button
		likesView.toogleLikeBtn(false)
		//Remove like from UI
		likesView.deleteLike(currenId);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
};
window.addEventListener('click', e => {
	const btn = e.target.closest('.recipe__love');
	if(btn){
		controlLike()
	}
});

// restore liked recipes on page load

window.addEventListener('load', ()=> {
	state.likes = new Like();

	//restore likes
	state.likes.readStorage();

	// Toggle like btn
	likesView.toggleLikeMenu(state.likes.getNumLikes());

	//render Likes to UI

	state.likes.likes.forEach(like => {
		likesView.renderLike(like);
	})
})