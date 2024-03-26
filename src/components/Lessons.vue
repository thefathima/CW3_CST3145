<template>
    <div>
        <div class="lessons-container">
            <div v-for="lesson in filteredLessons" class="lesson-box" :key="lesson.name">

                <!-- Lesson details -->
                <h2>{{ lesson.name }}</h2>
                <figure>
                    <img v-bind:src="lesson.image" style="height:250px; width:250px">
                </figure>

                <p>Location: {{ lesson.location }}</p>
                <p>Price: {{ lesson.price }} AED</p>
                <p>Availability: {{ lesson.availability }} spaces</p>

                <div>
                    <span v-for="n in lesson.rating" class="star" :key="n">★</span>
                    <span v-for="n in 5 - lesson.rating" class="star" :key="n">☆</span>
                </div>

                <button v-on:click='add(lesson)' :disabled="!canAddToCart(lesson)">

                    Add to Cart
                </button>
                <span v-if="lesson.availability === 0" class="out-of-stock">Out of stock</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Lessons-List",
    props: ['lessons', 'searchQuery'],
    methods: {
        add(lesson) {
            console.log("added lesson", lesson.name);
            this.$emit('addLesson', lesson);
        },
        // Check if lesson can be added to the cart
        canAddToCart: function (lesson) {

            return lesson.availability > 0;
        },
    },
    computed: {
        // Unique Search function for "Search as you type"
        filteredLessons: function () {
            //(this.searchQuery)refers to the user's input in the search bar.
            // It's a property in the Vue instance's data, representing the text that the user has entered for searching lessons.
            //(toLowerCase) JavaScript string method that converts all the characters in a string to lowercase.
            //By applying toLowerCase() to this.searchQuery, the user's input is converted to lowercase characters.
            //The result of this.searchQuery.toLowerCase() is stored in the variable query.
            //So, (query) now holds the lowercase version of the user's search input.
            const query = this.searchQuery.toLowerCase();

            //(!query) NOT operator used - checks if the user's search query is an empty string.
            //If the condition !query is true, indicating that the search query is empty, the computed property returns all lessons without filtering.
            //in this case - it returns the result of (this.sortedLessons), which is the array of lessons sorted based on the user's sorting preferences.               
            //helps to avoid unnecessary filtering when the user hasn't initiated a search. It ensures that, by default, all lessons are displayed when there's no specific search criteria.
            if (!query) return this.lessons; // If the query is empty, return all lessons

            //(.filter) method is an array method in JavaScript - creates a new array containing elements from the original array 
            //(lesson =>) arrow function takes each element of this.sortedLessons as lesson and executes the code within the curly braces.
            return this.lessons.filter(lesson => {
                // each lesson, it retrieves the name  and converts them to lowercase using toLowerCase().
                const lessonName = lesson.name.toLowerCase();
                // each lesson, it retrieves the location and converts them to lowercase using toLowerCase().
                const lessonLocation = lesson.location.toLowerCase();

                //checks whether either the lesson name or the lesson location includes the search query.
                //it returns true if the search query is found within the lesson name or location.
                return lessonName.includes(query) || lessonLocation.includes(query);
                //resulting array from this filter operation represents lessons that match the user's search criteria.
                //This array is then used to dynamically display only the relevant lessons on the website based on the user's input.
            });
        },
    }
}
</script>