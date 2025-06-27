# React + Vite Project

## Getting Started

Follow these steps to set up and run this project in **development** and **production** modes.

---

## Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended) → [Download](https://nodejs.org/)
- **npm** or **yarn** (Package manager)
- **Git** (Optional for cloning the repo)

---
updated
## Installation
### Clone the Repository
```sh
git clone https://github.com/gokulnathan66/music-recommender-frontend.git
cd project
```

### Install Dependencies
```sh
npm install  # or yarn install
```

---

## Running the Project

### Development Mode
Run the development server:
```sh
npm run dev
```
- The app will be available at: **`http://localhost:5173`**
- Auto-reloads on file changes.

---

### Production Mode
#### Build the Project
```sh
npm run build
```
- Generates an optimized **`dist/` folder**.

#### Preview the Production Build
```sh
npm run preview
```
- Serves the build at **`http://localhost:5173`**.

#### Serve the Build Using a Static Server *(Optional)*
```sh
npm install -g serve
serve -s dist -l 3000
```
- Runs the production build on **`http://localhost:517`**.

---

## Deployment
You can deploy the `dist/` folder using:
- **Vercel / Netlify** → Drag and drop `dist/`
- **AWS S3 + CloudFront** → Upload `dist/` to an S3 bucket
- **NGINX** (Self-hosting) → Serve the `dist/` folder

Example **NGINX Configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;
    location / {
        try_files $uri /index.html;
    }
}
```

---

## Troubleshooting
- If **port conflicts** occur, change the port in `vite.config.js`:
  ```js
  export default defineConfig({
    server: {
      port: 3001,
    },
  });
  ```
- If dependencies fail, try:
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  ```


## Contributing
1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a **Pull Request**

---
