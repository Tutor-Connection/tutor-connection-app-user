import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Initialize server-side Gemini AI
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI TutorPro suggestions will run in sandbox mode.");
}

// Endpoint: AI TutorPro suggestions
app.post("/api/tutorsync-ai", async (req, res) => {
  try {
    const { role, currentClasses, targetSubject, feeBudget } = req.body;
    
    // Fallback if Gemini key is missing
    if (!ai) {
      return res.json({
        success: true,
        isDemo: true,
        text: `**Mô phỏng Gợi ý từ AI TutorPro:**\n\n* **Khung giờ đề xuất:** 19h - 21h các ngày Thứ 3, 5, 7. Đây là khung giờ tối ưu nhất cho đối tượng học viên bận rộn.\n* **Đối với môn học ${targetSubject || "Toán/Tiếng Anh"}:** Nhu cầu gia sư lớp 9 và luyện thi Đại học đang rất cao.\n* **Học phí tối ưu:** Mức phí ${feeBudget || "300.000đ"} là cực kỳ cạnh tranh và thu hút nhiều ứng viên tài năng.\n\n*Vui lòng cấu hình GEMINI_API_KEY trong Settings > Secrets để sử dụng phản hồi trực tiếp của Trí Tuệ Nhân Tạo.*`
      });
    }

    let prompt = "";
    if (role === "tutor") {
      prompt = `Bạn là Trí tuệ Nhân tạo thông minh "AI TutorPro" thuộc hệ thống quản lý học tập tối ưu TutorSync.
Hãy đưa ra 3 lời khuyên mang tính chiến thuật, chất lượng cao, súc tích bằng tiếng Việt cho một Gia sư:
- Thông tin gia sư hiện tại: Lớp giảng dạy: ${JSON.stringify(currentClasses || [])}. 
- Định hướng tìm thêm học viên/môn học: ${targetSubject || "Chưa xác định"}.
- Yêu cầu cấu trúc đầu ra: Có tiêu đề rõ ràng, các ý ngắn gọn, có icon đẹp mắt, đề xuất cụ thể mức giá, khung giờ lý tưởng và phương pháp giảng dạy tăng trải nghiệm học tập. Trình bày dưới dạng Markdown đẹp đẽ, súc tích.`;
    } else {
      prompt = `Bạn là Trí tuệ Nhân tạo thông minh "AI TutorPro" thuộc hệ thống học tập tối ưu TutorSync.
Hãy đưa ra 3 lời khuyên chiến thuật, súc tích bằng tiếng Việt giúp một Học sinh / Học viên tìm kiếm gia sư lớp học tốt nhất:
- Môn học mong muốn: ${targetSubject || "Toán, Tiếng Anh giao tiếp hoặc Vật lý"}.
- Ngân sách đề xuất: ${feeBudget || "250.000đ - 350.000đ"}/buổi.
- Yêu cầu cấu trúc đầu ra: Định hướng tuyển chọn gia sư (số năm kinh nghiệm, kỹ năng sư phạm bổ trợ), cách deal giờ học hiệu quả, và lộ trình tương tác 1-1 tối ưu. Trình bày dưới dạng Markdown súc tích, tinh tế.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: "Bạn là chuyên gia tư vấn giáo dục hàng đầu có tên AI TutorPro. Trình bày câu trả lời của bạn súc tích, tinh gọn dễ hiểu và có nhịp điệu hoàn hảo, sử dụng các ký tự Markdown đẹp, có chia tiêu đề trực quan, tuyệt đối không rườm rà dài dòng."
      }
    });

    res.json({
      success: true,
      text: response.text
    });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Lỗi xử lý gợi ý AI."
    });
  }
});

// Start dev mode or static prod mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TutorSync Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
