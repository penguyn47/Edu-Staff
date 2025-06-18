### Project Name

A basic Next.js project which manage student. CRUD.

#### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18.x or higher)
- npm or yarn or pnpm
- Git

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/penguyn47/Edu-Staff
   ```
2. Navigate to the project directory
   ```bash
   cd Edu-Staff
   ```
3. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
4. Connect to your database with ".env" file
   ```bash
   DATABASE_URL="postgresql://[user]:[password]@localhost:5432/[db-name]"
   ```
5. Run migrations
   ```bash
   npx prisma migrate deploy
   ```
6. Run seed
   ```bash
   npx prisma db seed
   ```

#### Usage

1. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
2. Open your browser and visit http://localhost:3000.

#### Images

![Alt text](imgs/img-02.png)
![Alt text](imgs/img-03.png)
![Alt text](imgs/img-04.png)
![Alt text](imgs/img-05.png)
