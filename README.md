# Toy Sharing Web App

This is a simple web app for toy sharing between flats in an apartment. Each flat can upload toys, request toys from others, and return them after use. I made this project using only HTML, CSS, and JavaScript.

## How to Run

1. Download or clone this repository.
2. Open the `index.html` file in any browser.
3. Everything works in the browser using localStorage and sessionStorage. No backend or server is needed.

## Pages and Their Features

### 1. Login Page (`index.html`)
- Enter your flat number.
- The flat number is saved in sessionStorage.
- After login, it redirects to the dashboard.

### 2. Toy Dashboard (`dashboard.html`)
- Shows your flat number at the top.
- Form to upload a toy with:
  - Toy name
  - Description
  - Available from (start date)
  - Available till (end date)
  - Image upload (simulated, not functional)
- Shows the list of toys uploaded by your flat.
- Displays each toy's current status (Available / Requested).

### 3. Browse & Request Toys Page (`browse.html`)
- Displays toys shared by other flats.
- You can:
  - Search for toys by name or keyword
  - See toy name, description, owner flat number, availability
  - Request a toy if it's available
  - Return the toy when done
- Once requested, the toy is locked and shows "Requested by Flat X".

## Features Implemented

- Flat number login
- Upload toy with details
- List of uploaded toys with status
- View toys uploaded by other flats
- Request and return functionality
- Search bar for filtering toys
- All data stored using localStorage and sessionStorage

## Challenges Faced

Initially, I added notification messages for login, logout, requesting toys, and returning toys. But the notifications were not working properly and sometimes appeared at the wrong time or multiple times. It made the app confusing and buggy. So I removed that part of the code to keep the project simple. I will learn how to properly use notifications in the future and add them again later.

## Future Improvements

- Add proper image upload with preview
- Better styling and layout using CSS or Tailwind
- User authentication (login with password)
- Use a real backend and database like Firebase or Node.js
