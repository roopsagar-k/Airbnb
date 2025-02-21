import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import db from "./db.js";
import imageDownloader from "image-downloader";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://airbnb-clone.roopsagar.tech", // Single origin allowed
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function authenticateToken(req, res, next) {
  const { token } = req.cookies;
  if (token == null) {
    return res.status(401).json({ message: "Authentication required" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, {}, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token",
        error: err.message, // Include error details
      });
    }
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Healthy Server 💓");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(name, email, password, "user details for registration");
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND) || 10
    );
    const result = await db.query(
      "SELECT EXISTS (SELECT email FROM users WHERE email = $1);",
      [email]
    );
    if (!result.rows[0].exists) {
      await db.query(
        "INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
      );
      console.log("User registered successfully");
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      const passwordMatch = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (passwordMatch) {
        const token = jwt.sign(
          {
            name: user.rows[0].name,
            email: user.rows[0].email,
            id: user.rows[0].id,
          },
          process.env.SECRET_ACCESS_TOKEN
        );
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
          })
          .json({ message: "Login successful", user: user.rows[0] });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", authenticateToken, (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, sameSite: "none" })
    .json(true);
});

app.post("/uploadFromLink", async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }
    console.log("hit", link);
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    console.error("Upload from link error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  try {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const newPath = path + "." + parts[parts.length - 1];
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace("uploads\\", ""));
    }
    console.log(uploadedFiles);
    res.json(uploadedFiles);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload files" });
  }
});

app.post("/addNewPlace", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    if (
      !title ||
      !address ||
      !description ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const placeInserted = await db.query(
      "INSERT INTO places(title, address, photos, description, perks, extrainfo, checkin, checkout, maxguests, price, owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;",
      [
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        req.user.id,
      ]
    );
    res.status(201).json({
      message: "New place created successfully",
      place: placeInserted.rows[0],
    });
  } catch (error) {
    console.error("Add new place error:", error);
    res.status(500).json({ message: "Failed to create new place" });
  }
});

app.get("/getUserPlaces", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const places = await db.query("SELECT * FROM places WHERE owner = $1;", [
      id,
    ]);
    res.json(places.rows);
  } catch (error) {
    console.error("Get user places error:", error);
    res.status(500).json({ message: "Failed to fetch user places" });
  }
});

app.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const placeData = await db.query("SELECT * FROM places WHERE id = $1;", [
      id,
    ]);
    if (placeData.rows.length === 0) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(placeData.rows[0]);
  } catch (error) {
    console.error("Get place error:", error);
    res.status(500).json({ message: "Failed to fetch place data" });
  }
});

app.put("/updatePlaceData/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    if (
      !title ||
      !address ||
      !description ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await db.query(
      "UPDATE places SET title = $1, address = $2, photos = $3, description = $4, perks = $5, extrainfo = $6, checkin = $7, checkout = $8, maxguests = $9, price = $10 WHERE id = $11 AND owner = $12 RETURNING *;",
      [
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Place not found or you don't have permission to update it",
      });
    }

    res
      .status(200)
      .json({ message: "Place updated successfully", place: result.rows[0] });
  } catch (error) {
    console.error("Update place error:", error);
    res.status(500).json({ message: "Failed to update place" });
  }
});

app.get("/places", async (req, res) => {
  try {
    const places = await db.query("SELECT * FROM places;");
    res.json(places.rows);
  } catch (error) {
    console.error("Get all places error:", error);
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.query(
      "SELECT name, email FROM users WHERE id = $1;",
      [id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

app.post("/bookings", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const {
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      contactNumber,
      price,
    } = req.body;

    if (
      !place ||
      !checkIn ||
      !checkOut ||
      !numberOfGuests ||
      !name ||
      !contactNumber ||
      !price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await db.query(
      "INSERT INTO bookings (place, check_in, check_out, number_of_guests, name, contact_number, price, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [place, checkIn, checkOut, numberOfGuests, name, contactNumber, price, id]
    );

    res.status(201).json({
      status: "success",
      message: "Booking created",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

app.get("/getBookings", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const result = await db.query(
      "SELECT bookings.*, places.* FROM bookings INNER JOIN places ON bookings.place = places.id WHERE bookings.user_id = $1;",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

app.post("/filter", async (req, res) => {
  try {
    const { searchQuery } = req.body;
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const response = await db.query(
      "SELECT * FROM places WHERE LOWER(title) LIKE '%' || $1 || '%' OR LOWER(address) LIKE '%' || $1 || '%';",
      [searchQuery.toLowerCase()]
    );
    res.json(response.rows);
  } catch (error) {
    console.error("Filter places error:", error);
    res.status(500).json({ message: "Failed to filter places" });
  }
});

app.post("/addToFavorites", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { place_id } = req.body;
    if (!place_id) {
      return res.status(400).json({ message: "Place ID is required" });
    }
    const favorites = await db.query(
      "INSERT INTO favorites (user_id, place_id) VALUES($1, $2) RETURNING *;",
      [id, place_id]
    );
    res.status(201).json({
      status: "success",
      message: "Added to favorites",
      data: favorites.rows[0],
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ message: "Failed to add to favorites" });
  }
});

app.get("/getFavorites", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const response = await db.query(
      "SELECT place_id FROM favorites WHERE user_id = $1;",
      [id]
    );
    const arrayOfIds = response.rows.map((obj) => obj.place_id);
    res.json(arrayOfIds);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

app.post("/deleteFromFavorites", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { place_id } = req.body;
    if (!place_id) {
      return res.status(400).json({ message: "Place ID is required" });
    }
    const response = await db.query(
      "DELETE FROM favorites WHERE user_id = $1 AND place_id = $2 RETURNING *;",
      [id, place_id]
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Entry deleted from favorites",
    });
  } catch (error) {
    console.error("Delete from favorites error:", error);
    res.status(500).json({ message: "Failed to delete from favorites" });
  }
});

app.get("/getFavoritesPlaces", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const response = await db.query(
      "SELECT * FROM places p JOIN favorites f ON p.id = f.place_id AND f.user_id = $1;",
      [id]
    );
    res.json(response.rows);
  } catch (error) {
    console.error("Get favorite places error:", error);
    res.status(500).json({ message: "Failed to fetch favorite places" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`App is running at the port ${port}`);
});
