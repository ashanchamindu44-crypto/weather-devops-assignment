# Weather Dashboard

A modern, responsive weather dashboard application that displays current weather conditions and a 5-day forecast for any city worldwide.

## Group Information

| Role | Name | Student ID |
|------|------|------------|
| DevOps Engineer  | K G ASHAN CHAMINDU | ITBNM-2313-0009 |
| Backend Developer | G.O.A.SENARATH | ITBNM-2313-0077 |
| Frontend Developer | Y.Minruk Gamage | ITBNM-2313-0025 |

## Project Description

The Weather DevOps App is a responsive web application that allows users to search for weather information by entering a city name. The application fetches real-time weather data from the OpenWeatherMap API and displays important weather details such as temperature and weather conditions.

This project demonstrates professional Git workflows, DevOps practices, CI/CD automation, and cloud deployment using GitHub and Vercel.

## Live Deployment

🔗 Live URL: https://weather-devops-app.vercel.app

## Technologies Used

HTML5

CSS3

JavaScript

OpenWeatherMap API

Git & GitHub

GitHub Actions (CI/CD)

Vercel (Cloud Deployment)

## Features

Search weather by city name

Display current temperature

Display weather description

Responsive user interface

Real-time API data fetching

Continuous Integration using GitHub Actions

Automated deployment to Vercel

## Repository Structure
weather-devops-app
│
├── .github
│   └── workflows
│       ├── ci.yml
│       └── deploy.yml
│
├── src
│   ├── index.html
│   ├── styles
│   │   └── style.css
│   └── scripts
│       └── app.js
│
├── README.md
├── package.json
└── .gitignore
## Branch Strategy

We implemented the following Git branching strategy:

main → Production-ready code (protected branch)

develop → Integration branch for development

feature/* → Feature-specific branches used by individual developers

All feature branches were merged into develop via Pull Requests and later merged into main for production deployment.

## CI/CD Pipeline

We implemented Continuous Integration and Continuous Deployment using GitHub Actions.

## CI Pipeline

The CI pipeline runs automatically when code is pushed to:

main

develop

feature/*

CI tasks include:

Checking out repository

Installing dependencies

Running lint checks

Running build process

Running test scripts

CI configuration file:

.github/workflows/ci.yml
## Deployment Pipeline

The deployment pipeline runs when code is pushed to the main branch.

Deployment steps:

GitHub Actions triggers deployment workflow

Repository code is checked out

Application is deployed automatically to Vercel

Live website is updated

Deployment workflow file:

.github/workflows/deploy.yml
Build Status

## Individual Contributions
### (DevOps Engineer)

Repository initialization and configuration

Branch management strategy

GitHub Actions CI pipeline implementation

Deployment automation using Vercel

Branch protection configuration

Merge conflict resolution

Monitoring CI/CD pipelines

### (Backend Developer)

Implemented weather API integration

Developed weather data fetching functionality

Implemented asynchronous API calls

Handled API response parsing

Contributed backend logic improvements

### (Frontend Developer)

Designed responsive UI layout

Implemented user interface components

Styled the application using CSS

Integrated frontend with backend functionality

Maintained and updated README documentation

weather-devops-assignment

## Build Status

![CI Pipeline](https://github.com/ashanchamindu44-crypto/weather-devops-assignment/actions/workflows/ci.yml/badge.svg)

![Deploy](https://github.com/ashanchamindu44-crypto/weather-devops-assignment/actions/workflows/deploy.yml/badge.svg)

## Docker Setup
### Build Docker Image
docker build -t weather-devops-app .
### Run Docker Container
docker run -p 3000:3000 weather-devops-app

### Open in browser:

http://localhost:3000
### Run with Docker Compose
docker-compose up --build

### Stop containers:

docker-compose down
### Requirements

Docker installed

Docker Compose installed