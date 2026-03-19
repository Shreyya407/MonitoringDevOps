const express = require("express");
const os = require("os");
const cors = require("cors");

const app = express();
app.use(cors());

// 🔥 CPU usage using delta (REAL calculation)
let prevIdle = 0;
let prevTotal = 0;

const getCpuUsage = () => {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((cpu) => {
    for (let type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  });

  const idleDiff = idle - prevIdle;
  const totalDiff = total - prevTotal;

  prevIdle = idle;
  prevTotal = total;

  if (totalDiff === 0) return 0; // safety

  const usage = 1 - idleDiff / totalDiff;

  return Number((usage * 100).toFixed(2));
};

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Monitoring API is running");
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
  });
});

// Metrics route
app.get("/metrics", (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const cpu = getCpuUsage();

  console.log("CPU:", cpu); // 🔍 debug (optional)

  res.json({
    cpuUsage: cpu,
    totalMemory: totalMem,
    freeMemory: freeMem,
    usedMemory: usedMem,
    uptime: Math.round(os.uptime()),
    platform: os.platform(),
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
