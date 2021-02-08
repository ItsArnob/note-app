import { Router } from "express";
import path from "path";

const router = Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "home", "index.html"));
});

router.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "..",  "..", "views", "note", "index.html"));
});

export default router;