import {elements} from './base';

const step = (count) => {

	if(count < 1){
		return 0.5;
	} else if( count >= 1 && count < 10){
		return 1;
	} else if ( count >= 10 && count < 100) {
		return 5;
	} else if (count >= 100) {
		return 100;
	}

};

const createShopItem = (recipeItem) => {
	
	return ` 
		<li class="shopping__item" data-itemid='${recipeItem.id}'>
            <div class="shopping__count">
                <input type="number" value="${recipeItem.count}" step="${step(recipeItem.count)}" min="0" class="shopping__count-value">
                <p>${recipeItem.unit}</p>
            </div>
            <p class="shopping__description">${recipeItem.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>

	`

};

export const renderShopList = recipe => {
	
	const markup = `${recipe.items.map(el => createShopItem(el)).join('')}`
	elements.shoppingListResults.insertAdjacentHTML('afterbegin', markup);
};

export  const clearShopList = () => {
	elements.shoppingListResults.innerHTML = '';
};