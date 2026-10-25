# TrackBack

TrackBack is a music album review website. Visitors can browse albums by genre and see album details. Registered users can sign in to write reviews (reviews come in Assessment 3).

INT1059 Advanced Web, AIT Sydney. Group **Dragonfruit**: Gina, Emily and Vinny.

All albums and artists in the database are made up for this project, and the cover images are original.

---

## Tech stack

| Part | Technology |
|---|---|
| Front-end | React + TypeScript (Vite), React Bootstrap, React Router |
| Back-end | PHP API that returns JSON |
| Database | MySQL (MariaDB in XAMPP) |
| Local server | XAMPP (Apache + MySQL) |

React runs on `http://localhost:5173` and asks the PHP API for data. The PHP API runs on Apache (`http://localhost`) and talks to the database.

---

## Folder structure

```
2ASSESSMENT-ADVANCEDWEB/
├── api/                    PHP API (runs on XAMPP)
│   ├── config.php          shared setup: CORS, session, error handling
│   ├── db.php              database connection (PDO)
│   ├── response.php        sendJson() and sendError()
│   └── *.php               one file per endpoint
├── assets/images/albums/   album cover images
├── database/
│   └── trackback.sql       database schema + sample data
└── my-app/                 React app (Vite)
    └── src/
        ├── api.ts          apiGet() and apiPost(), the only place that calls the API
        ├── components/     parts used on many pages (navbar, footer, inputs)
        ├── pages/          one file per page
        ├── theme.css       site colours
        └── App.tsx         layout and routes
```

---

## How to run it

### What you need

- [XAMPP](https://www.apachefriends.org) (PHP 8.2)
- [Node.js](https://nodejs.org) LTS, version 22.22 or newer
- [Git](https://git-scm.com) or GitHub Desktop

### 1. Clone into the XAMPP folder

The project must be inside the XAMPP `htdocs` folder, and the folder name must stay **`2ASSESSMENT-ADVANCEDWEB`**. The React app uses this name to find the API.

| System | htdocs folder |
|---|---|
| Windows | `C:\xampp\htdocs` |
| Mac | `/Applications/XAMPP/xamppfiles/htdocs` |

```bash
cd C:\xampp\htdocs        # Mac: cd /Applications/XAMPP/xamppfiles/htdocs
git clone https://github.com/GinaMarcelaGarcia/2ASSESSMENT-ADVANCEDWEB.git
```

### 2. Start XAMPP

Open the XAMPP Control Panel (Mac: `manager-osx`) and start **Apache** and **MySQL**.

### 3. Import the database

1. Open `http://localhost/phpmyadmin`
2. Click **Import**
3. Choose `database/trackback.sql` and click **Import**

This creates the `trackback` database with 8 genres, 15 artists and 30 albums. Importing again resets it to the original data.

The API connects with the XAMPP default user (`root`, no password). If your MySQL has a password, change it in `api/db.php`.

### 4. Check the API

Open `http://localhost/2ASSESSMENT-ADVANCEDWEB/api/genres.php`

You should see:
```json
{"success":true,"data":[{"id":3,"name":"Electronic"}, ...]}
```

### 5. Start the React app

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:5173`. The red navbar should show, and the **Genres** menu should list 8 genres.

---

## API

Every answer has the same format:

```json
{ "success": true,  "data": ... }
{ "success": false, "error": "Message for the user" }
```

| Endpoint | Method | What it does | Status |
|---|---|---|---|
| `genres.php` | GET | List of all genres | Done |
| `me.php` | GET | User logged in now, or `null` | Done |
| `albums.php` | GET | Random albums, optional `?genre=ID` | In progress |
| `album.php?id=ID` | GET | One album with artist and genre | In progress |
| `register.php` | POST | Create an account | In progress |
| `login.php` | POST | Sign in and start the session | In progress |
| `logout.php` | POST | End the session | In progress |

### Rules for every endpoint

- Start with `require_once __DIR__ . '/config.php';`
- Answer only with `sendJson()` or `sendError()`, with the right status code
- Use prepared statements for any value that comes from the user
- Passwords use `password_hash()` and `password_verify()`
- Validate in PHP too, even if React already validated
- Never show raw PHP errors: use `try/catch`

---

## How we work with Git

- `HOME` is the main branch and must always work
- One branch per feature, created from an updated `HOME` (e.g. `feature/auth`)
- Small commits with a clear message (e.g. `Add login endpoint`)
- Pull request to merge into `HOME`
- Pull `HOME` before starting work each day

---

## Common problems

| Problem | Fix |
|---|---|
| `npm` blocked in PowerShell ("running scripts is disabled") | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once, or use Command Prompt |
| `genres.php` shows "Not Found" | The folder is not inside `htdocs` or has a different name |
| "Could not connect to the database." | MySQL is not running, or the database was not imported |
| Genres menu is empty | Apache is not running, or the API path is wrong |
| Album covers do not show | Check that `assets/images/albums/` exists in your copy |
