# Ajala Abdullah Portfolio

A modern, responsive, and dynamic portfolio website built for a Software Developer, Data Scientist, and Machine Learning Engineer.

## Features
- **Responsive Design**: Mobile-first architecture that looks great on all devices.
- **Dynamic Typing Effect**: Hero section features a clean typing animation for various roles.
- **Project Filtering**: Instantly filter projects by category (AI, Web, etc.).
- **Interactive Certificates**: Lightbox gallery for viewing certificates.
- **Working Contact Form**: Securely sends emails using a Node.js backend and the Resend API.

## Project Structure
- `index.html`: The main structural file containing the portfolio layout.
- `style.css`: The stylesheet defining the modern aesthetics and responsiveness.
- `script.js`: Frontend logic for animations, filtering, and form submission.
- `server.js`: Node.js/Express backend that handles the contact form API.
- `package.json`: Project dependencies for the backend.
- `assets/`: Directory containing images and other media.

## Running Locally

1. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   Start the Express server which handles the contact form emails:
   ```bash
   npm start
   ```
   *(The server will start on `http://localhost:3000`)*

3. **View the Website**
   Open `index.html` in your web browser, or serve it using a local development server like Live Server.

## Hosting & Deployment
To deploy this full-stack application (Static Frontend + Node.js Backend), it is recommended to use a service like **Render** or **Railway**, which can easily spin up the Node server and serve your static files simultaneously.

## Author
Ajala Abdullah
