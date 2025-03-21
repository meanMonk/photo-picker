const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const IMAGE_DIR = path.join(__dirname,"data");
const LIKED_DIR = path.join(__dirname, "liked");

// Ensure "liked" directory exists
if (!fs.existsSync(LIKED_DIR)) {
    fs.mkdirSync(LIKED_DIR);
}

app.use(express.static(path.join(__dirname)));  // Serve static files
app.use("/data",express.static(IMAGE_DIR));  // Serve original images
app.use("/liked", express.static(LIKED_DIR));  // Serve liked images

app.use(express.json());  // Middleware to parse JSON

// Fetch all images from the original folder
app.get("/images", (req, res) => {
    fs.readdir(IMAGE_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading directory" });
        res.json(files.filter(file => file.toLowerCase().endsWith(".jpg")));
    });
});

// Fetch all liked images
app.get("/liked-images", (req, res) => {
    fs.readdir(LIKED_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading liked directory" });
        res.json(files.filter(file => file.toLowerCase().endsWith(".jpg")));
    });
});

// Move liked image to "liked" folder
app.post("/like", (req, res) => {
    const { imageName } = req.body;
    if (!imageName) return res.status(400).json({ error: "No image name provided" });

    const oldPath = path.join(IMAGE_DIR, imageName);
    const newPath = path.join(LIKED_DIR, imageName);

    // Check if file exists before moving
    fs.rename(oldPath, newPath, (err) => {
        if (err) return res.status(500).json({ error: "Error moving file" });
        res.json({ message: `Image ${imageName} liked successfully!` });
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
