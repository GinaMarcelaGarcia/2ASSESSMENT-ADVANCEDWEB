# TrackBack

TrackBack is a music album review website. Visitors can browse albums, search and read reviews without account. When user sign in, they can write reviews, give a star rating, save favourite albums and manage the account.

**Live site:** http://trackback.free.nf
**Repository:** https://github.com/GinaMarcelaGarcia/2ASSESSMENT-ADVANCEDWEB

INT1059 Advanced Web, AIT Sydney. Group **Dragonfruit**: Gina, Emily and Vinny.

All albums and artists in the database are made up for this project.

---

## Features

- **Home page:** random albums carousel, genre filter (also in navbar), artist and year filters, Load More
- **Search:** find albums by title, artist or genre from the navbar
- **Album detail page:** cover, description, metadata (artist, genre, release date, writers, label) and average rating
- **Reviews:** signed in user can write, edit and delete own review with 1-5 stars. One review per album for each user
- **Favourites:** add and remove albums from favourites, list in the account page
- **My Account:** tabs for my reviews, my favourites and account settings (change username, email and password)
- **Register, sign in and log out:** validation in React and in PHP, password saved as hash, PHP session

### Additional features

- **Highest rated:** 8 albums with best average rating. Only albums with reviews appear
- **Browse by rating:** emoji filters for reviews: 🔥 Must Hear (4-5 stars), 💗 Loved (3 stars), 😐 Okay (1-2 stars)
- **Popular this week:** albums with most reviews in last 7 days come first

---

## Tech stack

| Part | Technology |
|---|---|
| Front-end | React + TypeScript (Vite), React Bootstrap, React Router, Bootstrap Icons |
| Back-end | PHP API that returns JSON |
| Database | MySQL (MariaDB in XAMPP) |
| Local server | XAMPP (Apache + MySQL) |
| Hosting | InfinityFree (Apache + PHP + MySQL) |


---

## How to run it

### What you need

- [XAMPP](https://www.apachefriends.org) (PHP 8.2)
- [Node.js](https://nodejs.org) LTS, version 22.22 or newer
- [Git](https://git-scm.com) or GitHub Desktop

### 1. Clone into the XAMPP folder

The project must be inside the XAMPP `htdocs` folder, and the folder name must stay **`2ASSESSMENT-ADVANCEDWEB`**. The React app uses this name to find the API in development.

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


**Test user:** `test@trackback.com` / `Test1234`

### 4. Create the database config file

The database details are not in GitHub. Copy the example file:

```
api/db.example.php  ->  api/db.local.php
```

For XAMPP you don't need to change anything (user `root`, no password). If your MySQL has a password, put it in `db.local.php`. This file is in `.gitignore`, so it never goes to GitHub.

### 5. Check the API

Open `http://localhost/2ASSESSMENT-ADVANCEDWEB/api/genres.php`

You should see:
```json
{"success":true,"data":[{"id":3,"name":"Electronic"}, ...]}
```

### 6. Start the React app

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:5173`. The red navbar should show, and the **Genres** menu should list 8 genres. Sign in with the test user to check the login.

---

## Live site (deployment)

The site is hosted on InfinityFree (free PHP + MySQL hosting): http://trackback.free.nf

How we deploy:

1. Run `npm run build` inside `my-app`. This makes the `dist` folder
2. Upload to the server `htdocs` folder with FileZilla (FTP):
   - everything inside `my-app/dist`
   - the `api` folder
   - the `assets/images/albums` folder (into `htdocs/assets/images/albums`)
3. On the server, `api/db.local.php` has the InfinityFree database details (not the XAMPP ones)
4. The database was imported in the InfinityFree phpMyAdmin, from a copy of `trackback.sql` without the `CREATE DATABASE` and `USE` lines (InfinityFree does not allow them)

In development React calls `http://localhost/...`. In the build it calls `/api`, because site and API are on the same domain.
The `.htaccess` file sends every React page to `index.html`, so refresh (F5) on `/album/5` works.

---
