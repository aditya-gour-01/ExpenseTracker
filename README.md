# Expense Tracker Web Application

A full-stack Expense Tracker web application built using ReactJS for the frontend and Django for the backend.
The application allows users to securely manage daily expenses, track spending patterns, generate reports, visualize expenses using charts, and export reports as PDF files.

---

# Features

* User Registration & Login
* Add New Expenses
* Manage Existing Expenses
* Update & Delete Expenses
* Expense Dashboard & Analytics
* Date-wise Expense Filtering
* Grand Total Calculation
* Expense Distribution Pie Chart
* Download Expense Reports as PDF
* Responsive UI using Bootstrap
* REST API Integration between React and Django

---

# Tech Stack

## Frontend

* ReactJS
* React Router DOM
* React Hooks (`useState`, `useEffect`)
* Fetch API
* Bootstrap
* React Toastify
* Chart.js
* React ChartJS 2

## Backend

* Django
* Django ORM
* SQLite Database
* ReportLab PDF Generator
* JSON APIs

---

# Project Structure

```bash
ExpenseTracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── expense/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── manage.py
│   └── ...
│
├── README.md
└── .gitignore
```

---

# Core Functionalities

## Authentication System

* User Signup API
* User Login API
* Session handling using Local Storage
* Route protection using React Router

## Expense Management

* Create Expenses
* Read/View Expenses
* Update Existing Expenses
* Delete Expenses

## Dashboard Analytics

* Today's Expense
* Yesterday's Expense
* Last 7 Days Expense
* Current Month Expense
* Current Year Expense
* Overall Expense Summary

## Expense Reports

* Search expenses between date ranges
* Generate dynamic expense reports
* Calculate grand total automatically
* Export reports as downloadable PDF files

---

# Frontend Concepts Used

* Component-Based Architecture
* State Management using `useState`
* Lifecycle Handling using `useEffect`
* Dynamic Routing
* Controlled Forms
* Conditional Rendering
* API Communication using Fetch API
* Dynamic Table Rendering using `.map()`
* Chart Visualization

---

# Backend Concepts Used

* Django Models
* Django ORM Queries
* Foreign Key Relationships
* REST-style API Development
* JSON Responses
* HTTP Methods (`GET`, `POST`, `PUT`, `DELETE`)
* Date Range Filtering
* Aggregation using `Sum`
* PDF Generation using ReportLab

---

# API Endpoints

| Method | Endpoint                            | Description         |
| ------ | ----------------------------------- | ------------------- |
| POST   | `/api/signup/`                      | Register user       |
| POST   | `/api/login/`                       | Login user          |
| POST   | `/api/add_expense/`                 | Add expense         |
| GET    | `/api/manage_expense/<user_id>/`    | Fetch expenses      |
| PUT    | `/api/update_expense/<expense_id>/` | Update expense      |
| DELETE | `/api/delete_expense/<expense_id>/` | Delete expense      |
| GET    | `/api/search_expense/<user_id>/`    | Search expenses     |
| POST   | `/api/change_password/<user_id>/`   | Change password     |
| GET    | `/api/expense_pdf/<user_id>/`       | Download PDF report |

---

# Database Models

## UserDetail Model

Stores:

* User Name
* Email
* Password
* Registration Date

## Expense Model

Stores:

* Expense Date
* Expense Item
* Expense Cost
* Expense Creation Date
* User Relationship using ForeignKey

---

# PDF Report Generation

The application dynamically generates expense reports in PDF format using ReportLab.

The PDF includes:

* Expense Date
* Expense Item
* Expense Cost
* Grand Total
* Date-wise Report Filtering

---

# Data Flow Architecture

```text
React Frontend
      ↓
Fetch API Requests
      ↓
Django REST APIs
      ↓
Django ORM
      ↓
SQLite Database
      ↓
JSON Response
      ↓
React UI Rendering
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/ExpenseTracker.git
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# Future Improvements

* JWT Authentication
* Password Hashing
* Expense Categories
* Monthly Expense Graphs
* Email Notifications
* Pagination
* Deployment using Docker
* Cloud Database Integration

---

# Learning Outcomes

This project helped in understanding:

* Full-Stack Development
* React Component Architecture
* REST API Communication
* CRUD Operations
* State Management
* Django Backend Development
* Database Relationships
* Chart Integration
* PDF Generation
* Frontend & Backend Integration

---

# Author

Aditya Gour


Please feel free to clone and modify this repo if any modifications can be done here. Would appreciate on this.
