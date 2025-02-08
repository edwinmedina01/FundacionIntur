export default function handler(req, res) {
    console.log("🔹 API Test ejecutándose...");
    res.status(200).json({ mensaje: "API Test OK" });
}
