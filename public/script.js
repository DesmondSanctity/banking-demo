const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const submitLogin = document.getElementById('submitLogin');
const submitSignup = document.getElementById('submitSignup');
const websocketDemo = document.getElementById('websocketDemo');
const successBtn = document.getElementById('successBtn');
const errorBtn = document.getElementById('errorBtn');
const demoInput = document.getElementById('demoInput');

let ws;

function showLoginForm() {
 loginForm.style.display = 'block';
 signupForm.style.display = 'none';
 websocketDemo.style.display = 'none';
}

function showSignupForm() {
 loginForm.style.display = 'none';
 signupForm.style.display = 'block';
 websocketDemo.style.display = 'none';
}

function showWebSocketDemo() {
 loginForm.style.display = 'none';
 signupForm.style.display = 'none';
 websocketDemo.style.display = 'block';
}

function updateNavButtons() {
 if (localStorage.getItem('token')) {
  loginBtn.textContent = 'Author';
  loginBtn.onclick = () => window.open('https://author-link.com', '_blank');
  signupBtn.textContent = 'Source Code';
  signupBtn.onclick = () =>
   window.open('https://source-code-link.com', '_blank');
 } else {
  loginBtn.textContent = 'Login';
  loginBtn.onclick = showLoginForm;
  signupBtn.textContent = 'Sign Up';
  signupBtn.onclick = showSignupForm;
 }
}

showSignup.addEventListener('click', showSignupForm);
showLogin.addEventListener('click', showLoginForm);

submitLogin.addEventListener('click', async () => {
 const email = document.getElementById('loginEmail').value;
 const password = document.getElementById('loginPassword').value;

 try {
  const response = await fetch('/api/users/login', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
   const { token } = await response.json();
   localStorage.setItem('token', token);
   updateNavButtons();
   showWebSocketDemo();
   initWebSocket();
  } else {
   const errorData = await response.json();
   alert(`Login failed: ${errorData.message}`);
  }
 } catch (error) {
  console.error('Login error:', error);
  alert('An error occurred during login. Please try again.');
 }
});

submitSignup.addEventListener('click', async () => {
 const name = document.getElementById('signupName').value;
 const email = document.getElementById('signupEmail').value;
 const password = document.getElementById('signupPassword').value;

 try {
  const response = await fetch('/api/users/signup', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
   alert('Signup successful! Please log in.');
   showLoginForm();
  } else {
   const errorData = await response.json();
   alert(`Signup failed: ${errorData.message}`);
  }
 } catch (error) {
  console.error('Signup error:', error);
  alert('An error occurred during signup. Please try again.');
 }
});

function initWebSocket() {
 ws = new WebSocket('ws://localhost:8080');

 ws.onopen = () => {
  const token = localStorage.getItem('token');
  ws.send(JSON.stringify({ type: 'auth', token }));
 };

 ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
 };
}

successBtn.addEventListener('click', () => {
 if (ws && ws.readyState === WebSocket.OPEN) {
  ws.send(
   JSON.stringify({
    type: 'event.interaction',
    data: demoInput.value,
   })
  );
  demoInput.value = '';
 }
});

errorBtn.addEventListener('click', () => {
 if (ws && ws.readyState === WebSocket.OPEN) {
  ws.send(
   JSON.stringify({
    type: 'event.error',
    data: Math.random().toString(36).substring(7),
   })
  );
 }
});

// Initialize the page
function init() {
 updateNavButtons();
 // Check if the user is logged in and show the WebSocket demo
 if (localStorage.getItem('token')) {
  showWebSocketDemo();
  initWebSocket();
 } else {
  showLoginForm();
 }
}

// Call init on page load
init();
