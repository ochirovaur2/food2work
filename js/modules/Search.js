import axios from "axios";
import {key} from '../config';
export default class Search {
	constructor(query){

		this.query = query;

	}
	async getResults(query){
		
	
	try{
		const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);

		this.result = res.data.recipes;
		
	} catch (error) {
		alert(error);
	}
	
};
}





//getResults('pizza');
// key = 3d8b33a054cca8a586b99b0cbe1fa329

//https://www.food2fork.com/api/search