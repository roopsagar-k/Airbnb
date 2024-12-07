import "dotenv/config";
import express, { urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import db from "./db.js";
import imageDownloader from "image-downloader";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Healthy Server 💓");
});

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(
    password,
    process.env.SALT_ROUND | 0
  );
  const result = await db.query(
    "SELECT EXISTS (SELECT email FROM users WHERE email = $1 );",
    [email]
  );
  if (!result.rows[0].exists) {
    await db.query(
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (user.rows.length > 0) {
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
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
        .cookie("token", token)
        .json({ message: "Login successful", user: user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/profile", authenticateToken, (req, res) => {
  if (req.user) {
    res.json(req.user);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/uploadFromLink", async (req, res) => {
  const { link } = req.body;
  console.log("hit", link);
  const newName = "photo" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
  } catch (err) {
    console.log(err);
  }

  console.log("damn you");
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
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
});

app.post("/addNewPlace", authenticateToken, async (req, res) => {
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

  try {
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
    res.status(201).json({ message: "New place created successfully" });
  } catch (err) {
    throw err;
  }
});

app.get("/getUserPlaces", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const places = await db
    .query("SELECT * FROM places WHERE owner = $1;", [id])
    .catch((err) => console.error(err));
  res.json(places.rows);
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const placeData = await db
    .query("SELECT * FROM places WHERE id = $1;", [id])
    .catch((err) => console.log(err));
  res.json(placeData.rows[0]);
});

app.put("/updatePlaceData/:id", authenticateToken, async (req, res) => {
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
  await db
    .query(
      "UPDATE places SET title = $1, address = $2, photos = $3, description = $4, perks = $5, extrainfo = $6, checkin = $7, checkout = $8, maxguests = $9, price = $10 WHERE id = $11 AND owner = $12;",
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
    )
    .catch((err) => console.log(err));
  res.status(200).json({ message: "Place updated successfully" });
});

app.get("/places", async (req, res) => {
  const places = await db.query("SELECT * FROM places;");
  res.json(places.rows);
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = await db
    .query("SELECT name, email FROM users WHERE id = $1;", [id])
    .catch((err) => {
      throw err;
    });
  res.json(user.rows[0]);
});

app.post("/bookings", authenticateToken, async (req, res) => {
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

  const result = await db
    .query(
      "INSERT INTO bookings (place, check_in, check_out, number_of_guests, name, contact_number, price, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [place, checkIn, checkOut, numberOfGuests, name, contactNumber, price, id]
    )
    .catch((err) => {
      throw err;
    });

  res.status(201).json({
    status: "success",
    message: "Booking created",
    data: result.rows[0],
  });
});

app.get("/getBookings", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const result = await db.query(
    "SELECT bookings.*, places.* FROM bookings INNER JOIN places ON bookings.place = places.id WHERE bookings.user_id = $1;",
    [id]
  );
  console.log(result.rows);
  res.json(result.rows);
});

app.post("/filter", async (req, res) => {
  const response = await db.query(
    "SELECT * FROM places WHERE LOWER(title) LIKE '%' || $1 || '%' OR LOWER(address) LIKE '%' || $1 || '%';", 
    [req.body.searchQuery.toLowerCase()]
  );
  res.json(response.rows);
}); 

app.post("/addToFavorites", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { place_id } = req.body;
  console.log(place_id);
  const favorites = await db.query(
    "INSERT INTO favorites (user_id, place_id) VALUES($1, $2) RETURNING *;",
    [id, place_id]
  ).catch(err => console.error(err));
  res.status(201).json({
    status: "success",
    message: "Added to favorites",
  });
});

app.get("/getFavorites", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const response = await db.query("SELECT place_id FROM favorites WHERE user_id = $1;", [id]);
  const arrayOfIds = response.rows.map(obj => obj.place_id);
  res.json(arrayOfIds);
})

app.post("/deleteFromFavorites", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { place_id } = req.body;
    console.log(place_id);
    const response = await db.query("DELETE FROM favorites WHERE user_id = $1 AND place_id = $2;", [id, place_id]);
    console.log(response);
    res.status(200).json({
      status: "success",
      message: "Entry deleted from favorites",
    });
  } catch (error) {
    console.error("Error deleting from favorites:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getFavoritesPlaces", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const response = await db.query(
    "SELECT * FROM places p JOIN favorites f ON p.id = f.place_id AND f.user_id = $1;",
    [id]
  );
  console.log(response.rows);
  res.json(response.rows);
})

function authenticateToken(req, res, next) {
  const { token } = req.cookies;
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, {}, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`App is running at the port ${port}`);
});
