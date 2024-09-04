const projects = JSON.parse(localStorage.getItem("projects")) || [];
const currentProject = document.querySelector("#project-name");

// First Sample todo list
const sampleTodo = {
  title: "Buy groceries",
  description: "Get milk, eggs, and bread",
  dueDate: "2024-08-10",
  priority: "Medium",
};

function saveProjectsToLocalStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function createDefaultProject(projectName, sampleTodo) {
  if (!projects.some((project) => project.name === projectName)) {
    createProject(projectName);
    addTodoToProject(projectName, sampleTodo); // Use the same project name here
    currentProject.textContent = projectName;
    saveProjectsToLocalStorage();
  }
}

document
  .getElementById("submit-project")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Get input values
    const projectName = document.getElementById("projectName").value;

    // Check if the project name is filled
    if (!projectName) {
      alert("Please fill in the project name.");
      return;
    }

    addProject(projectName, sampleTodo);
    document.querySelector("#projectName").value = "";
    saveProjectsToLocalStorage();
  });

document
  .getElementById("submit-todo")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Get input values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    // Check if all fields are filled
    if (!title || !description || !dueDate || !priority) {
      alert("Please fill in all the fields.");
      return;
    }

    const isUpdating =
      document.getElementById("submit-todo").dataset.isUpdating === "true";
    const todoIndex = document.getElementById("submit-todo").dataset.todoIndex;

    if (isUpdating) {
      updateTodoInProject(currentProject.textContent, todoIndex);
    } else {
      addTodo(title, description, dueDate, priority);
    }

    // Clear input values
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("priority").value = "Medium";
    saveProjectsToLocalStorage();
  });

// Create project sections
function createProjectSectionButtons() {
  const container = document.querySelector(".added-projects");
  container.innerHTML = ""; // Clear existing buttons
  projects.forEach((project) => {
    const projectName = project.name;

    const button = document.createElement("button");
    button.textContent = projectName;
    button.classList.add("project-button");
    button.addEventListener("click", () => {
      // Update the displayed project name when a button is clicked
      currentProject.textContent = projectName;
      console.log(`Clicked on project: ${projectName}`);
      createTodoSectionCards(); // Update the todo list display
    });

    container.appendChild(button);
  });
}

// Create todo cards for project
function createTodoSectionCards() {
  const container = document.querySelector(".added-todos");
  container.innerHTML = ""; // Clear existing todo cards
  const projectName = currentProject.textContent;
  const project = projects.find((p) => p.name === projectName);

  if (project && project.todos.length > 0) {
    project.todos.forEach((todo, index) => {
      // Add index here
      const todoCard = document.createElement("div");
      todoCard.classList.add("todo-card-container");

      const todoTitle = document.createElement("h3");
      todoTitle.textContent = todo.title;
      todoTitle.style.fontStyle = "italic";
      todoTitle.style.textAlign = "center";
      todoCard.appendChild(todoTitle);

      const todoDescription = document.createElement("p");
      todoDescription.textContent = `Description: ${todo.description}`;
      todoDescription.style.textAlign = "center";
      todoCard.appendChild(todoDescription);

      const todoDueDate = document.createElement("p");
      todoDueDate.textContent = `Due Date: ${todo.dueDate}`;
      todoDueDate.style.textAlign = "center";
      todoCard.appendChild(todoDueDate);

      const todoPriority = document.createElement("p");
      todoPriority.textContent = `Priority: ${todo.priority}`;
      todoPriority.style.textDecoration = "underline";
      todoPriority.style.textAlign = "center";
      todoCard.appendChild(todoPriority);

      const deleteElement = document.createElement("i");
      deleteElement.className = "bx bx-trash";
      deleteElement.style.fontSize = "20px";
      deleteElement.style.textAlign = "center";
      deleteElement.style.color = "white";
      deleteElement.style.padding = "5px";
      deleteElement.style.cursor = "pointer";

      // Add styles for the background square
      deleteElement.style.display = "inline-block"; // Ensures element occupies space
      deleteElement.style.width = "25px"; // Adjust width as needed
      deleteElement.style.height = "25px"; // Adjust height as needed
      deleteElement.style.backgroundColor = "#ef4444";
      deleteElement.style.borderRadius = "4px"; // Optional: Add rounded corners

      deleteElement.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click event from bubbling up
        removeTodoFromProject(projectName, index); // Pass the current index
        saveProjectsToLocalStorage();
      });

      todoCard.addEventListener("click", () => {
        // Trigger the update function when the todo card is clicked
        toggleTodoPopup(); // Show the popup for updating
        document.getElementById("title").value = todo.title;
        document.getElementById("description").value = todo.description;
        document.getElementById("dueDate").value = todo.dueDate;
        document.getElementById("priority").value = todo.priority;
        document.getElementById("submit-todo").dataset.isUpdating = "true";
        document.getElementById("submit-todo").dataset.todoIndex = index;
      });

      todoCard.addEventListener("mouseover", () => {
        todoCard.style.cursor = "pointer"; // Change mouse type to pointer when hovering over card
      });

      // Append the icon to the container
      todoCard.appendChild(deleteElement);

      container.appendChild(todoCard);
    });
  } else {
    const noTodosMessage = document.createElement("p");
    noTodosMessage.textContent = "No tasks available for this project.";
    container.appendChild(noTodosMessage);
  }
}

function updateTodoInProject(projectName, todoIndex) {
  const project = projects.find((p) => p.name === projectName);
  if (project) {
    const updatedTodo = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      dueDate: document.getElementById("dueDate").value,
      priority: document.getElementById("priority").value,
    };

    project.todos[todoIndex] = updatedTodo;
    createTodoSectionCards();
    saveProjectsToLocalStorage();

    // Hide the pop-up and backdrop
    const popup = document.querySelector("#todo-popup");
    const backdrop = document.querySelector("#backdrop");
    popup.style.display = "none";
    backdrop.style.display = "none";

    document.getElementById("submit-todo").dataset.isUpdating = "false";
    document.getElementById("submit-todo").dataset.todoIndex = "";
  } else {
    console.log(`Project "${projectName}" not found.`);
  }
}

function createProject(projectName) {
  const project = {
    name: projectName,
    todos: [],
  };
  projects.push(project);
}

function addProject(projectName, sampleTodo) {
  // Remove any existing project with the same name
  const existingProjectIndex = projects.findIndex(
    (project) => project.name === projectName
  );
  if (existingProjectIndex !== -1) {
    projects.splice(existingProjectIndex, 1);
  }

  if (projectName) {
    createDefaultProject(projectName, sampleTodo); // Pass an empty object if no sample todo
    createProjectSectionButtons(); // Update the UI with the new project
  } else {
    console.log(`Project "${projectName}" already exists.`);
  }
  // Hide the pop-up and backdrop
  const popup = document.querySelector("#project-popup");
  const backdrop = document.querySelector("#backdrop");
  popup.style.display = "none";
  backdrop.style.display = "none";
  saveProjectsToLocalStorage();
}

// Add todo list function
function addTodo(title, description, dueDate, priority) {
  // Check if dueDate is provided
  if (!dueDate) {
    console.error("Due date is required.");
    return;
  }

  // Ensure valid date object
  const newDate = new Date(dueDate); // No need to rearrange components
  if (isNaN(newDate.getTime())) {
    console.error("Invalid due date provided.");
    return;
  }

  // Use the original dueDate (already in "YYYY-MM-DD" format)

  const todoItem = {
    title,
    description,
    dueDate,
    priority,
  };

  const projectName = currentProject.textContent;
  addTodoToProject(projectName, todoItem);
  console.log(`Added todo to project: ${projectName}`);
  createTodoSectionCards();
  saveProjectsToLocalStorage();

  // Hide the pop-up and backdrop
  const popup = document.querySelector("#todo-popup");
  const backdrop = document.querySelector("#backdrop");
  popup.style.display = "none";
  backdrop.style.display = "none";
}

function removeTodoFromProject(projectName, todoIndex) {
  const project = projects.find((p) => p.name === projectName);
  if (project) {
    project.todos.splice(todoIndex, 1); // Remove the todo item at the specified index
    createTodoSectionCards(); // Update the UI
    saveProjectsToLocalStorage();
  } else {
    console.log(`Project "${projectName}" not found.`);
  }
}

// Toggle add project popup
function toggleProjectPopup() {
  const popup = document.querySelector("#project-popup");
  const backdrop = document.querySelector("#backdrop");
  popup.style.textAlign = "center";

  if (popup.style.display === "grid") {
    popup.style.display = "none"; // Hide the pop-up
    backdrop.style.display = "none"; // Hide the backdrop
  } else {
    popup.style.display = "grid"; // Show the pop-up
    backdrop.style.display = "block"; // Show the backdrop
  }
}

// Toggle add todo list pop up
function toggleTodoPopup() {
  const popup = document.querySelector("#todo-popup");
  const backdrop = document.querySelector("#backdrop");

  if (popup.style.display === "grid") {
    popup.style.display = "none"; // Hide the pop-up
    backdrop.style.display = "none"; // Hide the backdrop
  } else {
    popup.style.display = "grid"; // Show the pop-up
    backdrop.style.display = "block"; // Show the backdrop
  }
}

// Clear input for add project pop up
function clearProjectInputs() {
  // Clear the input values
  document.querySelector("#projectName").value = "";

  // Hide the pop-up and backdrop
  const popup = document.querySelector("#project-popup");
  const backdrop = document.querySelector("#backdrop");
  popup.style.display = "none";
  backdrop.style.display = "none";
}

// Clear input for add todo pop up
function clearTodoInputs() {
  // Clear the input values
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#dueDate").value = "";
  document.querySelector("#priority").value = "Medium";

  // Hide the pop-up and backdrop
  const popup = document.querySelector("#todo-popup");
  const backdrop = document.querySelector("#backdrop");
  popup.style.display = "none";
  backdrop.style.display = "none";
}

function addTodoToProject(projectName, todoItem) {
  const project = projects.find((p) => p.name === projectName);
  if (project) {
    project.todos.push(todoItem);
  } else {
    console.log(`Project "${projectName}" not found.`);
  }
}

createDefaultProject("My Default Project", sampleTodo);
createProjectSectionButtons();
createTodoSectionCards();
