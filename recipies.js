// API endpoint URL
const apiUrl = 'http://127.0.0.1:8000';
const recipesApiUrl = `${apiUrl}/recipes`;

// form input elements
const recipeForm = document.getElementById('recipe-form');
const recipeNameInput = document.getElementById('recipe-name');
const ingredientsInput = document.getElementById('ingredients');


// Function to fetch and display recipes
async function fetchRecipes() {
    try {
        const response = await fetch(recipesApiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayRecipes(data);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        displayErrorMessage('Error fetching recipes. Please try again later.');
    }
}


// Function to display recipes
function displayRecipes(recipes) {
    const recipeDisplay = document.getElementById('recipe-display');
    // Clearing any existing content
    recipeDisplay.innerHTML = '';
    // Iterating through the recipes
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-card');

        const recipeName = document.createElement('h3');
        recipeName.textContent = recipe.name;

        const recipeIngredients = document.createElement('p');
        recipeIngredients.textContent = `Ingredients: ${recipe.ingredients.join(', ')}`;

        //creating a delete button
        const deleteButton = createDeleteButton(recipe.id);

        // Creating an "Edit" button for the recipe
        const editButton = createEditButton(recipe);

        // Appending elements to the recipeDiv
        recipeDiv.appendChild(recipeName);
        recipeDiv.appendChild(recipeIngredients);
        recipeDiv.appendChild(deleteButton);
        recipeDiv.appendChild(editButton);

        // Appending the recipeDiv to the recipeDisplay container
        recipeDisplay.appendChild(recipeDiv);
    });
}


// Function to add a new recipe
function addRecipe(recipeData) {
    fetch(recipesApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Recipe added:', data);
        fetchRecipes();
    })
    .catch(error => {
        console.error('Error adding recipe:', error);
    });
}


// Event listener for the "Add Recipe" form submission
recipeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Capturing the recipe details from the form fields
    const recipeName = recipeNameInput.value;
    const recipeIngredients = ingredientsInput.value.split(',').map(item => item.trim());

    // Creating a recipe object with the captured data
    const newRecipe = {
        name: recipeName,
        ingredients: recipeIngredients,
    };
    // Calling the addRecipe function
    addRecipe(newRecipe);

    // Clearing the form fields
    recipeNameInput.value = '';
    ingredientsInput.value = '';
});


// Function to delete a recipe by its ID
function deleteRecipe(recipeId) {
    fetch(`${recipesApiUrl}/${recipeId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Recipe deleted:', data);
        fetchRecipes();
    })
    .catch(error => {
        console.error('Error deleting recipe:', error);
    });
}

// Function to create a "Delete" button for a recipe
function createDeleteButton(recipeId) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', function() {
        // Asking for confirmation before deleting
        if (confirm('Are you sure you want to delete this recipe?')) {
            deleteRecipe(recipeId);
        }
    });
    return deleteButton;
}


// Function to update a recipe by its ID
function updateRecipe(recipeId, updatedRecipeData) {
    fetch(`${recipesApiUrl}/${recipeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipeData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Recipe updated:', data);
        fetchRecipes();
    })
    .catch(error => {
        console.error('Error updating recipe:', error);
    });
}


// Function to create an "Edit" button for a recipe
function createEditButton(recipe) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');

    editButton.addEventListener('click', function() {
        // Creating a form to edit the recipe
        const editForm = document.createElement('form');
        editForm.innerHTML = `
            <label for="edit-name">Name:</label>
            <input type="text" id="edit-name" name="edit-name" value="${recipe.name}" required>

            <label for="edit-ingredients">Ingredients:</label>
            <textarea id="edit-ingredients" name="edit-ingredients" required>${recipe.ingredients.join(', ')}</textarea>

            <button type="submit">Update</button>
        `;
        // Event listener for the "submit" event of the edit form
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Capturing the updated recipe details from the form fields
            const updatedName = document.getElementById('edit-name').value;
            const updatedIngredients = document.getElementById('edit-ingredients').value.split(',').map(item => item.trim());

            // Creating an updated recipe object
            const updatedRecipe = {
                name: updatedName,
                ingredients: updatedIngredients,
            };
            updateRecipe(recipe.id, updatedRecipe);
            editForm.remove();
            // Refreshing the displayed recipes after updating
            fetchRecipes();
        });
        // Replacing the recipe details with the edit form
        const recipeDiv = editButton.parentElement;
        recipeDiv.innerHTML = '';
        recipeDiv.appendChild(editForm);
    });
    return editButton;
}

//Error Handling
function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block'; // Show the error message
}

// Calling the fetchRecipes function when the page loads
window.addEventListener('load', fetchRecipes);



