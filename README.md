# TrackBack

TrackBack is a music album review website. Visitors can browse albums by genre and see album details without an account. Users can register, sign in and log out. Writing reviews, favourites and the account page come in Assessment 3.

INT1059 Advanced Web, AIT Sydney. Group **Dragonfruit**: Gina, Emily and Vinny.

All albums and artists in the database are made up for this project, and the cover images are original.

---

## Features

Status at the end of Assessment 2 (prototype).

### Done

- **Live dataset:** MySQL database with 30 albums, 15 artists and 8 genres
- **Home page:** random albums, genre filter (also in the navbar), artist and year filters, Load More
- **Album detail page:** cover, title, description and metadata (artist, genre, release date, writers, label), average rating or "No reviews yet"
- **Register, sign in and log out:** modal forms, validation in React and PHP, passwords saved as a hash, session in PHP
- **Navbar:** shows "Sign In" / "Register", or the username and "Log out" when signed in
- **Popular this week** (additional feature): albums with the most reviews in the last 7 days come first. Until reviews exist, albums show in default order

### Planned for Assessment 3

- Write, edit and delete reviews (the reviews on the album page are sample data for now)
- Favourites list
- My Account page (my reviews, favourites, account settings)
- Search
- Highest rated and Browsing by rating (Must Hear / Loved / Okay)
- Mobile layout fixes on the Home page

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

This creates the `trackback` database with 8 genres, 15 artists, 30 albums and one test user. Importing again resets it to the original data (users registered on your computer are deleted).

**Test user:** `test@trackback.com` / `Test1234`

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

Open `http://localhost:5173`. The red navbar should show, and the **Genres** menu should list 8 genres. Sign in with the test user to check the login.

---

## Common problems

| Problem | Fix |
|---|---|
| `genres.php` shows "Not Found" | The folder is not inside `htdocs` or has a different name |
| "Could not connect to the database." | MySQL is not running, or the database was not imported |
| Genres menu is empty | Apache is not running, or the API path is wrong |
| Album covers do not show | Check that `assets/images/albums/` exists in your copy |
| Nothing loads and the browser console (F12) shows a CORS error | React must run on `localhost:5173` or `5174`, the only addresses allowed in `api/config.php` |
