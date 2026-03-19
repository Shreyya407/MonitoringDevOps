const express =require ("express");
const os = require("os");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/" , (req,res) => {
res.send("Monitoring API running ");
});

app.get("/metrics" ,(req,res) => {
const cpu=os.loadavg()[0];
const totalMem =os.totalmem();
const freeMem = os.freemem();

res.json({
cpu,
totalMemory: totalMem,
freeMemory: freeMem,
uptime:os.uptime()
});
});

app.listen(3000,"0.0.0.0",() => {
console.log("Server running on port 3000");
});

