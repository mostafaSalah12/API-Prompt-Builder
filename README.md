# Prototype Designer (API Prompt Builder)

A Next.js application designed to help developers build, test, and manage API prompts and specifications.

## Prerequisites

- **Node.js**: v18.17.0 or higher.
- **pnpm**: This project uses `pnpm` as the package manager.

## Installation

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd prototype-designer
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Then edit `.env` and set a secure `JWT_SECRET_KEY`.

4.  **Database Setup:**
    Initialize the database using the script:
    ```bash
    pnpm run db:push
    ```
    > **Note**: To completely reset the database (wiping all data), use:
    > ```bash
    > pnpm run db:reset
    > ```

## Development Mode

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.



## Database Management

We have included handy scripts for database operations:

- **Sync Schema to DB**:
  ```bash
  pnpm run db:push
  ```
- **Open Database GUI (Prisma Studio)**:
  ```bash
  pnpm run db:studio
  ```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom components with Lucide React icons.
- **Theme**: Light/Dark mode via `next-themes`.

## License

Distributed under the MIT License. See `LICENSE` for more information.