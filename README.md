This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





# 📦 Git Workflow – Comenzi uzuale (VS Code / Terminal)

Acest fișier conține **toate comenzile Git necesare** pentru:
- prima urcare pe GitHub
- lucru zilnic
- schimbare dispozitiv (PC / laptop)
- finalizarea corectă a sesiunii de lucru

---

## 🔹 1️⃣ Prima urcare pe GitHub (o singură dată / proiect nou)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/NUME-REPO.git
git push -u origin main


Lucru zilnic (după ce modifici codul)

Verifici ce s-a schimbat:

git status


Urcare modificări:

git add .
git commit -m "Descriere scurtă a modificărilor"
git push



ucru zilnic (după ce modifici codul)

Verifici ce s-a schimbat:

git status


Urcare modificări:

git add .
git commit -m "Descriere scurtă a modificărilor"
git push


Când începi o sesiune de lucru
git pull
npm run dev

🔹 6️⃣ Când termini de lucrat (OBLIGATORIU)
git status
git add .
git commit -m "Work in progress"
git push