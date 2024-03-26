<template>
  <div id="app">
    <main>
      <!-- Display site name using mustache syntax-->
      <h1>{{ sitename }}</h1>
      <!--syntax for data binding (dynamically updates when value of 'sitename' variable changes)-->

      <!-- Label for the sort dropdown -->
      <label for="sortAttribute">Sort by:</label>

      <!-- Dropdown for selecting sorting attribute -->
      <!--v-model="sortattribute" is a vue.js directive - it creates 2 way binding b/w sortAttribute in data & select element-->
      <!--if the user selects an option, sortAttribute in my Vue.js instance will be updated, and vice versa-->
      <select v-model="sortAttribute" id="sortAttribute">
        <option value="name">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="availability">Spaces</option>
        <!--<option> Elements: are individual options within the dropdown. -->
        <!--Each option has a value attribute representing the sorting attribute, and the text content inside the <option> tag is what the user sees in the dropdown menu.-->
      </select>

      <!-- Dropdown for selecting sorting order -->
      <!---->
      <label for="sortOrder">Order:</label>

      <!-- v-model="sortOrder" establishes a two-way binding between the dropdown and the data in the Vue instance-->
      <select v-model="sortOrder" id="sortOrder">
        <!--Ascending" is chosen, lessons will be sorted from the smallest to the largest-->
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
        <!--user selects an option, the sortOrder variable is updated with the chosen value.-->
      </select>
      <!--SEARCH BAR-->
      <!--(type="text"): This sets the input field to accept text-->
      <input type="text" v-model="searchQuery" placeholder="Search lessons">
      <!--v-model="searchQuery": establishes a two-way binding between the input field and the searchQuery variable in the Vue instance-->
      <!--As the user types into the search bar, the searchQuery variable is automatically updated with the input.-->


      <!-- SHOPPING CART BUTTON -->
      <!--(v-on:click='toggleCart') Vue.js directive - listens for a click event
            When the button is clicked, it triggers the toggleCart method in the Vue instance.-->
      <button v-on:click='toggleCart' :disabled="cart.length === 0">
        <!--(disabled="cart.length === 0") Vue.js directive - for dynamic attribute binding
            disables button if the condition cart.length === 0 evaluates to true. (if the shopping cart is empty, the button is disabled; otherwise, it's enabled)-->
        {{ cartItemCount }}
        <!--computed property in the Vue instance that dynamically calculates and updates the number of items in the shopping cart.-->
        <span class="fas fa-cart-plus"></span> Shopping Cart
      </button>

      <lessons-list :lessons="sortedLessons" :searchQuery="searchQuery" @addLesson="addToCart" v-if="showProduct"></lessons-list>
      <checkout-page :cart="cart" @remove-item="removeFromCart" v-else></checkout-page>
    </main>
  </div>
</template>

<script>
import lessonsList from './components/Lessons.vue'
import checkoutPage from './components/Checkout.vue'
export default {
  components: {
    lessonsList, checkoutPage
  },
  name: "App",
  data() {
    return {
      // Site name mounting the app
      sitename: "After School Lessons",
      // Flag to toggle between lesson display and shopping cart/checkout (flag is like a switch: when its true then it displays lessons, when its false = checkout page)
      showProduct: true,
      //an array of lessons with various attributes (JSON objects)
      lessons: [], //an array of lessons with various attributes (JSON objects)
      // Array to store items in the cart
      cart: [],
      // Attribute to sort lessons by (default: Name of Subject)
      sortAttribute: "name",
      // Order to sort lessons (default: Ascending)
      sortOrder: "asc",
      // Order information (full name, phone)

      // Validation flags for full name and phone number
      validFullName: false,
      validPhone: false,

      // User input for lesson search
      searchQuery: '',
    }
  },
  //---------------------------------GET (Fetch)--------------------------------------------------------------//
  created:
    function () {
      // set the url to your server and route
      //..fetch GET to retrieve all lessons from lessons collection from mongodb
      //..the url is the connection to AWS server
      fetch('http://cst3145-cw2-env.eba-qvjju2fi.eu-west-2.elasticbeanstalk.com/collection/lessons', {

        method: 'GET', // set the HTTP method as 'GET'
        headers: {
          'Content-Type': 'application/json', // set the data type as JSON
        }
      })
        .then(res => {
          return res.json();
        })
        // after getting the json data from mongob, it is stored in the lessons array
        .then(data => {
          this.lessons = data;
        })
    },
  methods: {
    toggleCart() {
      this.showProduct = !this.showProduct;
    },
    // This method is responsible for adding a lesson to the shopping cart
    addToCart: function (lesson) { //lesson object as a parameter
      console.log("addLesson event received by the root component.");
      if (lesson.availability > 0) { //checks if the availability of the lesson is greater than 0
        this.cart.push(lesson);
        //If the availability is greater than 0, the lesson is added to the cart array, and the availability is decremented by 1.
        lesson.availability--;
      }
    },
    // Remove lesson from the cart
    removeFromCart: function (lesson) {
      console.log("remove-item event received by the root component.");

      const index = this.cart.indexOf(lesson);

      if (index !== -1) { //if index is not equal to -1

        this.cart.splice(index, 1);

        //increments the availability of the specific lesson by 1 after removing it from the cart.
        lesson.availability++;
      }
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || '';
    },
    // Sort and filter lessons based on user input
    sortedLessons: function () {
      // Sorting logic for lessons
      // retrieves the sorting attribute (this.sortAttribute) from the Vue instance's data.
      // The (this.sortAttribute) represents the property of the lessons by which the lessons should be sorted (e.g., "name," "location," "price," etc.).
      const attribute = this.sortAttribute; //sorting by name, under the data
      const order = this.sortOrder === "asc" ? 1 : -1; //1 is ascending, -1 is descending

      return this.lessons.slice(0).sort((a, b) => { //slice of 0 = starts traversing (going thru each letter of the alphabet one by one) from the first letter of name
        //a and b r two random variables I've declared
        let aValue = a[attribute]; //taking one alphabet letter and compared it with the other
        let bValue = b[attribute];

        if (typeof aValue === "string") { //checking the type of value is entered as the variable, if its a string force it to be lowercase
          aValue = aValue.toLowerCase(); //aValue is converted to lower case (if it is string)
          bValue = bValue.toLowerCase(); //to make the comparison more accurate, both the variables r lowercase (cz lower case has different values and uppercase have different values)
        }

        if (aValue > bValue) { //if aValue is bigger than bValue
          return order; //then it is shown in ascending 
        } else if (aValue < bValue) { //if aValue is smaller than bValue
          return -order; //then it is shown in descending order
        }

        return 0; //ends the function
      });
    },
  },
};
</script>