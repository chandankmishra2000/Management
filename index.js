require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure 'uploads/deliverables' folder exists
const uploadDir = path.join(__dirname, "uploads", "deliverables");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     // Your email
    pass: process.env.EMAIL_PASS,     // Your app password
  },
});

// Routes

// ✅ Default health check
app.get("/", (req, res) => {
  res.send("✅ Backend running...");
});

// ✅ Create new project
app.post("/api/projects", async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        deadline,
        status: "PENDING", // Ensure your schema uses uppercase enum
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// ✅ Get all projects with bids
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { bids: true },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Place bid
app.post("/api/projects/:projectId/bids", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sellerName, amount, estimatedTime, message } = req.body;

    const bid = await prisma.bid.create({
      data: {
        sellerName,
        amount: parseFloat(amount),
        estimatedTime,
        message,
        projectId: parseInt(projectId),
      },
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "Failed to place bid" });
  }
});

// ✅ Select seller & notify via email
app.put("/api/projects/:projectId/select-seller", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sellerName, sellerEmail } = req.body;

    const project = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: { status: "IN_PROGRESS" },
    });

    const mailOptions = {
      from: `"Project Platform" <${process.env.EMAIL_USER}>`,
      to: sellerEmail,
      subject: `You've been selected for project: ${project.title}`,
      html: `
        <h2>Congratulations, ${sellerName}!</h2>
        <p>You have been selected to work on: <strong>${project.title}</strong></p>
        <p>Please log in to your dashboard and begin work.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Seller selected and email sent", project });
  } catch (error) {
    console.error("Error selecting seller:", error);
    res.status(500).json({ error: "Failed to select seller" });
  }
});

// ✅ Upload deliverable
app.post("/api/projects/:projectId/deliverable", upload.single("file"), async (req, res) => {
  try {
    const { projectId } = req.params;
    const filePath = `uploads/deliverables/${req.file.filename}`;

    const updated = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        status: "COMPLETED",
        deliverableUrl: filePath, // Make sure `deliverableUrl` exists in your Prisma schema
      },
    });

    res.status(200).json({ message: "File uploaded", project: updated });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});


const { sendSelectionEmail } = require("./mailer");

app.post("/api/projects/:projectId/select-seller", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sellerName, sellerEmail } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        status: "IN_PROGRESS",
        selectedSellerName: sellerName,
        selectedSellerEmail: sellerEmail,
      },
    });

    await sendSelectionEmail(sellerEmail, updatedProject.title);

    res.json(updatedProject);
  } catch (err) {
    console.error("Error selecting seller:", err);
    res.status(500).json({ error: "Failed to select seller" });
  }
});

// PATCH: Select a seller for a project
app.patch("/api/projects/:projectId/select-seller", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { selectedSellerName, selectedSellerEmail } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        status: "IN_PROGRESS",
        selectedSellerName,
        selectedSellerEmail,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error("Error selecting seller:", error);
    res.status(500).json({ error: "Failed to select seller" });
  }
});
