
 # 📸 Memory Lane

> A personal AI-powered digital scrapbook where you can upload photos, save your memories, and get smart auto-tagging using AI.

---

## ✨ Features

- 🖼️ Upload your memories with image + description
- 🧠 AI-generated tags for better search (coming soon)
- 🔐 Secure login with Clerk
- 📁 View, filter, and manage your digital scrapbook
- ⚡ Built with performance-first stack (Vite + Zustand)

---

## 📦 Tech Stack

| Layer        | Tools                             |
|--------------|------------------------------------|
| Frontend     | React, TypeScript, Tailwind CSS, shadcn/ui |
| State Mgmt   | Zustand                            |
| Forms        | React Hook Form + Zod              |
| Auth         | Clerk (or Firebase as fallback)    |
| Image Upload | Cloudinary                         |
| AI Tags      | Replicate API (Image Captioning)   |
| Backend*     | Node.js, Express, MongoDB (coming soon) |

---

## 🚧 MVP Roadmap (Week 1)

- [x] Project setup (Vite, Tailwind, shadcn/ui)
- [x] Routing: Home, Upload, View Memories
- [ ] Auth with Clerk
- [ ] Upload memory (form with image preview)
- [ ] AI tags mock generation
- [ ] Memory list view (gallery style)
- [ ] Deploy frontend to Vercel

---

## 🧠 How It Works

1. User logs in securely using Clerk
2. Uploads a memory (image + story)
3. (Soon) Image is analyzed via AI → tags are auto-generated
4. Memories are saved and displayed in a scrapbook grid

---

## 🔧 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/memory-lane.git
cd memory-lane

# 2. Install dependencies
pnpm install   # or yarn / npm

# 3. Run the app
pnpm dev

