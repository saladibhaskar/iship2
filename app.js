document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the user input and format the ingredients
    const ingredientInput = document.getElementById('ingredients').value.trim();
    const ingredients = ingredientInput.split(',').map(ing => ing.trim());

    if (ingredients.length === 0) {
        document.getElementById('recipeResults').innerHTML = '<p>Please enter at least one ingredient.</p>';
        return;
    }

    // Show loading message
    document.getElementById('recipeResults').innerHTML = '<p>Loading recipes...</p>';

    // Fetch recipes for each ingredient
    const fetchPromises = ingredients.map(ingredient => {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
        return fetch(apiUrl).then(response => response.json());
    });

    // Process all the fetch promises
    Promise.all(fetchPromises)
        .then(results => {
            let combinedMeals = [];
            results.forEach(result => {
                if (result.meals) {
                    if (combinedMeals.length === 0) {
                        // Initialize the combined meals array with the first result
                        combinedMeals = result.meals;
                    } else {
                        // Filter the recipes to keep only those that appear in both sets
                        combinedMeals = combinedMeals.filter(meal =>
                            result.meals.some(m => m.idMeal === meal.idMeal)
                        );
                    }
                }
            });

            // Display the results
            if (combinedMeals.length > 0) {
                let output = '';
                combinedMeals.forEach(meal => {
                    output += `
                        <div class="recipe-card">
                            <h3>${meal.strMeal}</h3>
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <p><a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank">View Recipe</a></p>
                        </div>
                    `;
                });
                document.getElementById('recipeResults').innerHTML = output;
            } else {
                document.getElementById('recipeResults').innerHTML = '<p>No recipes found with the given ingredients.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            document.getElementById('recipeResults').innerHTML = '<p>Something went wrong. Please try again.</p>';
        });
});
