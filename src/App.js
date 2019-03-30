import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      cart: [],
      searchKey: ''
    };

    this.search = this.search.bind(this);
    this.getDish = this.getDish.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.updateCart = this.updateCart.bind(this);
  }

  componentDidMount(){
    fetch('http://temp.dash.zeta.in/food.php')
    .then(response =>  response.json())
    .then(resData => {
      this.setState({
        data: resData,
        selectedCategory: resData.categories[0].name
      });
    })
  }

  getDish(dish, buttonText){
    return (
      <div>
        <div className="dish-image-container">
          <img src={dish.image} />
        </div>
        <div className="dish-details-container">
          <div>
            <h3 className="dish-name" title={dish.name}>{dish.name}</h3>
            <p className="dish-price">{dish.price}</p>
          </div>
          <button className="primary-button" onClick={(ev) => this.updateCart(ev,dish)}>{buttonText}</button>
        </div>
      </div>
    )
  }

  search(ev){
    this.setState({
      searchKey: ev.target.value
    });
  }

  selectCategory(ev){
    this.setState({
      selectedCategory: ev.target.id
    });
  }

  updateCart(ev, dish){
    let cart = this.state.cart;
    cart.push(dish);
    this.setState({
      cart: cart
    });
  }

  render() {
    const recipes = this.state.data && this.state.data.recipes;
    const favFood = recipes && recipes.filter(recipe => recipe.isFavourite);
    const categories = this.state.data && this.state.data.categories;
    let dishes = recipes && recipes.filter(recipe => recipe.category === this.state.selectedCategory);
    if (this.state.searchKey) {
      let searchKey = this.state.searchKey.toLowerCase();
      dishes = dishes.filter(dish => (dish.name.toLowerCase()).indexOf(searchKey)>-1);
    }
    return (
      <div className="App">
        <header className="App-header">
          Best Food App
        </header>
        <main>
          <section className="fav-section-wrapper">
            <article className="fav-section-wrapper-heading">
              <div>
                <h3>Favourites</h3>
                <p>Enjoy what you have been ordering</p>
              </div>
              <div>
                <i>{this.state.cart.length}</i>
              </div>
            </article>
            <article className="fav-section-wrapper-body">
              <div className="hori-scrollable">
              {favFood && favFood.map((fav) => {
                return (
                  <div className="fav-dish-wrapper">
                    {this.getDish(fav, "reorder")}                    
                  </div>
                )
              })}                
              </div>
            </article>
          </section>
          <section className="categories-section">
            <input type="text" value={this.state.searchKey} onChange={this.search} placeholder="Search" className="search-bar" />
            <div className="categories-section-heading">
              <h3>Select Categories</h3>
              <p>Filter</p>
            </div>
            <div className="categories-bar hori-scrollable">
              {categories && categories.map((category) => {
                return (
                  <div className="category-wrapper">
                    <input type="radio" name="radio" id={category.name} checked={category.name===this.state.selectedCategory} onChange={this.selectCategory} />
                    <label className="category-label" htmlFor={category.name}>
                      <img className="category-icon" src={category.image} />
                      <span>{category.name}</span>
                    </label>
                  </div>
                )
              })}
            </div>
            <div className="category-dish-container">
              {dishes && dishes.map((dish) => {
                return(
                  <div>{this.getDish(dish, "Add to bag")}</div>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
