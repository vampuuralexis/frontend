// Utils
const apiBase = location.hostname === 'localhost'
  ? 'http://localhost:3000/api' // local backend
  : 'https://backend-production-34fd.up.railway.app/api'; // deployed backend

// Validation functions
function validateUsername(username) {
  if (!username || username.length < 3) {
    return "Benutzername muss mindestens 3 Zeichen lang sein";
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.length < 12) {
    return "Passwort muss mindestens 12 Zeichen lang sein";
  }
  if (!/[A-Z]/.test(password)) {
    return "Passwort muss mindestens einen Großbuchstaben enthalten";
  }
  if (!/[a-z]/.test(password)) {
    return "Passwort muss mindestens einen Kleinbuchstaben enthalten";
  }
  if (!/[0-9]/.test(password)) {
    return "Passwort muss mindestens eine Zahl enthalten";
  }
  return null;
}

function showError(message) {
  alert(message);
}

// Register
async function registerUser(username, password) {
  try {
    const res = await fetch(`${apiBase}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login
async function loginUser(username, password) {
  try {
    const res = await fetch(`${apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Fetch all classes
async function getClasses() {
  try {
    const res = await fetch(`${apiBase}/classes`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
}

// Add new class
async function addClass(className) {
  try {
    const res = await fetch(`${apiBase}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ className }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to add class');
    }
    return data;
  } catch (error) {
    console.error('Error adding class:', error);
    throw error;
  }
}

// Delete class
async function deleteClass(className) {
  try {
    const res = await fetch(`${apiBase}/classes/${encodeURIComponent(className)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete class');
    }
    return data;
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
}

// Update class name
async function renameClass(oldClassName, newClassName) {
  try {
    const res = await fetch(`${apiBase}/classes/${encodeURIComponent(oldClassName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newClassName }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to rename class');
    }
    return data;
  } catch (error) {
    console.error('Error renaming class:', error);
    throw error;
  }
}

// Get students in a class
async function getStudents(className) {
  try {
    const res = await fetch(`${apiBase}/classes`);
    const data = await res.json();
    return data[className] || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

// Add student to class
async function addStudent(className, studentName) {
  try {
    const res = await fetch(`${apiBase}/classes/${encodeURIComponent(className)}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to add student');
    }
    return data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
}

// Remove student from class
async function removeStudent(className, index) {
  try {
    const res = await fetch(`${apiBase}/classes/${encodeURIComponent(className)}/students/${index}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to remove student');
    }
    return data;
  } catch (error) {
    console.error('Error removing student:', error);
    throw error;
  }
}

// Update student name
async function updateStudent(className, index, newStudentName) {
  try {
    const res = await fetch(`${apiBase}/classes/${encodeURIComponent(className)}/students/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStudentName }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update student');
    }
    return data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

// Show login page
function showLoginPage() {
  document.getElementById("content").innerHTML = `
    <div id="loginSection">
      <h2>Login</h2>
      <input type="text" id="username" placeholder="Benutzername" />
      <input type="password" id="password" placeholder="Passwort" />
      <button onclick="login()">Anmelden</button>
      <p>Oder <a href="#" onclick="showRegisterPage()">registrieren</a></p>
    </div>
  `;
}

// Show register page
function showRegisterPage() {
  document.getElementById("content").innerHTML = `
    <div id="registerSection">
      <h2>Registrieren</h2>
      <input type="text" id="regUsername" placeholder="Benutzername (min. 3 Zeichen)" />
      <input type="password" id="regPassword" placeholder="Passwort (min. 12 Zeichen, 1 Groß-, 1 Kleinbuchstabe, 1 Zahl)" />
      <button onclick="register()">Registrieren</button>
      <p>Oder <a href="#" onclick="showLoginPage()">zurück zum Login</a></p>
    </div>
  `;
}

// Show main page (class overview)
function goToStartseite() {
  loadClasses();
}

async function loadClasses() {
  try {
    const classes = await getClasses();
    const classNames = Object.keys(classes);
    
    document.getElementById("content").innerHTML = `
      <div id="classOverview">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2>Klassenübersicht</h2>
          <button onclick="logout()" style="background-color: #dc3545; color: white;">Abmelden</button>
        </div>
        <div id="searchContainer">
          <input type="text" id="searchInput" placeholder="Klasse suchen..." onkeyup="filterClasses()" />
        </div>
        <div id="addClassContainer">
          <input type="text" id="newClassName" placeholder="Neue Klasse hinzufügen..." />
          <button onclick="createNewClass()">Klasse hinzufügen</button>
        </div>
        <div id="classList">
          ${classNames.length === 0 ? '<p>Keine Klassen vorhanden</p>' : 
            classNames.map(className => `
              <div class="classItem" onclick="showClassDetails('${className}')">
                <h3>${className}</h3>
                <p>${classes[className].length} Schüler</p>
              </div>
            `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading classes:', error);
    showError('Fehler beim Laden der Klassen: ' + error.message);
  }
}

// Filter classes by search input
function filterClasses() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const classItems = document.querySelectorAll(".classItem");
  
  classItems.forEach(item => {
    const className = item.querySelector("h3").textContent.toLowerCase();
    if (className.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Create new class
async function createNewClass() {
  const className = document.getElementById("newClassName").value.trim();
  
  if (!className) {
    showError("Bitte geben Sie einen Klassennamen ein");
    return;
  }
  
  try {
    await addClass(className);
    document.getElementById("newClassName").value = "";
    loadClasses(); // Refresh the list
  } catch (error) {
    showError('Fehler beim Erstellen der Klasse: ' + error.message);
  }
}

// Show class details
async function showClassDetails(className) {
  try {
    const students = await getStudents(className);
    
    document.getElementById("content").innerHTML = `
      <div id="classDetails">
        <h2>Klasse: ${className}</h2>
        <button onclick="loadClasses()">← Zurück zur Übersicht</button>
        
        <div id="classActions">
          <button onclick="promptRenameClass('${className}')">Klasse umbenennen</button>
          <button onclick="promptDeleteClass('${className}')" style="background-color: #dc3545; color: white;">Klasse löschen</button>
        </div>
        
        <div id="addStudentContainer">
          <input type="text" id="newStudentName" placeholder="Schüler hinzufügen..." />
          <button onclick="addNewStudent('${className}')">Schüler hinzufügen</button>
        </div>
        
        <div id="studentList">
          <h3>Schüler (${students.length})</h3>
          ${students.length === 0 ? '<p>Keine Schüler in dieser Klasse</p>' : 
            students.map((student, index) => `
              <div class="studentItem">
                <span>${student}</span>
                <button onclick="promptRenameStudent('${className}', ${index}, '${student}')">Umbenennen</button>
                <button onclick="promptDeleteStudent('${className}', ${index})" style="background-color: #dc3545; color: white;">Löschen</button>
              </div>
            `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading class details:', error);
    showError('Fehler beim Laden der Klassendetails: ' + error.message);
  }
}

// Add new student
async function addNewStudent(className) {
  const studentName = document.getElementById("newStudentName").value.trim();
  
  if (!studentName) {
    showError("Bitte geben Sie einen Schülernamen ein");
    return;
  }
  
  try {
    await addStudent(className, studentName);
    document.getElementById("newStudentName").value = "";
    showClassDetails(className); // Refresh the class details
  } catch (error) {
    showError('Fehler beim Hinzufügen des Schülers: ' + error.message);
  }
}

// Prompt to rename class
function promptRenameClass(oldClassName) {
  const newClassName = prompt("Neuer Klassenname:", oldClassName);
  if (newClassName && newClassName.trim() !== "") {
    renameClassAction(oldClassName, newClassName.trim());
  }
}

async function renameClassAction(oldClassName, newClassName) {
  try {
    await renameClass(oldClassName, newClassName);
    loadClasses(); // Go back to class overview
  } catch (error) {
    showError('Fehler beim Umbenennen der Klasse: ' + error.message);
  }
}

// Prompt to delete class
function promptDeleteClass(className) {
  if (confirm(`Sind Sie sicher, dass Sie die Klasse "${className}" löschen möchten?`)) {
    deleteClassAction(className);
  }
}

async function deleteClassAction(className) {
  try {
    await deleteClass(className);
    loadClasses(); // Go back to class overview
  } catch (error) {
    showError('Fehler beim Löschen der Klasse: ' + error.message);
  }
}

// Prompt to rename student
function promptRenameStudent(className, index, currentName) {
  const newName = prompt("Neuer Schülername:", currentName);
  if (newName && newName.trim() !== "") {
    renameStudentAction(className, index, newName.trim());
  }
}

async function renameStudentAction(className, index, newName) {
  try {
    await updateStudent(className, index, newName);
    showClassDetails(className); // Refresh the class details
  } catch (error) {
    showError('Fehler beim Umbenennen des Schülers: ' + error.message);
  }
}

// Prompt to delete student
function promptDeleteStudent(className, index) {
  if (confirm("Sind Sie sicher, dass Sie diesen Schüler löschen möchten?")) {
    deleteStudentAction(className, index);
  }
}

async function deleteStudentAction(className, index) {
  try {
    await removeStudent(className, index);
    showClassDetails(className); // Refresh the class details
  } catch (error) {
    showError('Fehler beim Löschen des Schülers: ' + error.message);
  }
}

// Login function
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Validate inputs
  const usernameError = validateUsername(username);
  if (usernameError) {
    showError(usernameError);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    showError(passwordError);
    return;
  }

  try {
    const data = await loginUser(username, password);
    if (data.message === "Login success") {
      localStorage.setItem("is_logged_in", "true");
      goToStartseite();
    } else {
      showError("Login fehlgeschlagen: " + (data.message || "Unbekannter Fehler"));
    }
  } catch (error) {
    showError("Login fehlgeschlagen: " + error.message);
  }
}

// Register function
async function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value;

  // Validate inputs
  const usernameError = validateUsername(username);
  if (usernameError) {
    showError(usernameError);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    showError(passwordError);
    return;
  }

  try {
    const data = await registerUser(username, password);
    if (data.message === "Registered successfully") {
      alert("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
      showLoginPage();
    } else {
      showError("Registrierung fehlgeschlagen: " + (data.message || "Unbekannter Fehler"));
    }
  } catch (error) {
    showError("Registrierung fehlgeschlagen: " + error.message);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  if (isLoggedIn) {
    goToStartseite();
  } else {
    showLoginPage();
  }
});

// Logout function
function logout() {
  localStorage.removeItem("is_logged_in");
  showLoginPage();
}
