# Simple Event Manager

## Table of Contents
*   [Introduction](#introduction)
*   [Features](#features)
*   [Technology Stack](#technology-stack)
*   [Architecture Overview](#architecture-overview)
*   [Core Entities](#core-entities)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Database Setup](#database-setup)
    *   [Running the Application](#running-the-application)
*   [Usage](#usage)
*   [Future Enhancements](#future-enhancements)
*   [Contributing](#contributing)
*   [License](#license)

## Introduction
The Simple Event Manager is a basic yet comprehensive application designed to facilitate the management of events. Users can seamlessly perform essential operations such as creating new events, viewing a list of all existing events, inspecting the detailed information of a specific event, modifying event details, and removing events from the system. This project serves as a practical demonstration of a full-stack application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL, emphasizing a clear and maintainable architecture.

## Features
The application provides the following core functionalities:

*   **Create New Event:** Users can add new events to the system by providing essential details such as title, description, date, and location.
*   **View All Events:** A dedicated page displays a list of all events currently stored in the system, providing a quick overview.
*   **View Event Details:** Clicking on an event from the list navigates to a detailed view, showing all information pertaining to that specific event.
*   **Edit Event:** Users can update the details of an existing event, ensuring information remains current and accurate.
*   **Delete Event:** The ability to remove events from the system when they are no longer needed.

## Technology Stack
This project is built using a modern and efficient technology stack:

*   **Framework:** [Next.js](https://nextjs.org/) (React Framework for production)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (Superset of JavaScript for type safety)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (Powerful, open-source relational database)
*   **ORM:** None (Direct SQL queries via a lightweight data access layer)
*   **Authentication:** None (Out of scope for this basic project)

## Architecture Overview
The architecture leverages Next.js's full-stack capabilities to unify both frontend and backend logic, resulting in a streamlined development experience.

*   **Frontend (Next.js & React):**
    *   The user interface is built with React components, rendered by Next.js.
    *   Pages utilize Next.js's routing system.
    *   Client-side data fetching (e.g., using `fetch` or a similar library) interacts with the Next.js API routes for dynamic content updates.
    *   Styling is managed efficiently with Tailwind CSS, providing a responsive and modern aesthetic.
    *   TypeScript ensures robust code quality and maintainability across the UI components.

*   **Backend (Next.js API Routes):**
    *   Next.js API routes (`/pages/api/*`) serve as the application's backend API endpoints.
    *   These routes handle incoming HTTP requests (GET, POST, PUT, DELETE) from the frontend.
    *   They are responsible for interacting directly with the PostgreSQL database.
    *   No separate backend server (e.g., Express.js) is required, simplifying deployment and development.
    *   Database operations are performed using direct SQL queries, providing full control over data interactions without an ORM.

*   **Database (PostgreSQL):**
    *   PostgreSQL is used for persistent storage of event data.
    *   It hosts a single `events` table, designed to store all relevant event information.
    *   The database connection and query execution logic are encapsulated within the API routes.

*   **Data Flow:**
    1.  User interacts with the frontend (Next.js/React).
    2.  Frontend dispatches API requests (e.g., `GET /api/events`, `POST /api/events`) to the Next.js API routes.
    3.  Next.js API routes process the request, validate input (if applicable), and execute appropriate SQL queries against the PostgreSQL database.
    4.  PostgreSQL returns results to the API route.
    5.  The API route formats the data (e.g., JSON) and sends it back to the frontend.
    6.  The frontend updates the UI based on the received data.

## Core Entities
The primary entity managed by this application is `Event`.

### Event
Represents a single event with the following attributes:

*   `id`: `UUID` (Primary Key, unique identifier for the event)
*   `title`: `VARCHAR(255)` (The name or title of the event)
*   `description`: `TEXT` (A detailed description of the event)
*   `date`: `TIMESTAMP` (The date and time of the event)
*   `location`: `VARCHAR(255)` (The physical or virtual location of the event)
*   `createdAt`: `TIMESTAMP` (Timestamp when the event record was created, defaults to `NOW()`)
*   `updatedAt`: `TIMESTAMP` (Timestamp when the event record was last updated, defaults to `NOW()` on update)

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:

*   **Node.js**: v18.x or higher
*   **npm** or **Yarn**: npm v9.x / Yarn v1.x or higher
*   **PostgreSQL**: v14.x or higher (and a running instance)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/simple-event-manager.git
    cd simple-event-manager
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Database Setup
1.  **Create a PostgreSQL database:**
    ```sql
    CREATE DATABASE event_manager_db;
    ```
2.  **Connect to your new database** and create the `events` table:
    ```sql
    CREATE TABLE events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Optional: Add a trigger to update 'updatedAt' on modification
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    ```
3.  **Configure environment variables:**
    Create a `.env.local` file in the root of the project and add your PostgreSQL connection string:
    ```
    DATABASE_URL="postgresql://user:password@host:port/event_manager_db"
    ```
    Replace `user`, `password`, `host`, and `port` with your PostgreSQL credentials.

### Running the Application
1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

## Usage
*   The homepage (`/`) will likely redirect to `/events` or display an introduction.
*   Navigate to `/events` to view the list of all events.
*   Click on a "Create Event" button (usually found on the `/events` page) to add a new event.
*   From the event list, click on an event's title or a "View Details" button to see its full information.
*   On the event details page, you should find options to "Edit" or "Delete" the event.

## Future Enhancements
This project provides a solid foundation. Potential future enhancements include:

*   **Authentication & Authorization:** Implement user accounts and secure access control.
*   **Search & Filtering:** Add capabilities to search for events by title, description, or filter by date/location.
*   **Calendar View:** Integrate a calendar component for a visual representation of events.
*   **Reminders/Notifications:** Implement a system for sending event reminders.
*   **Improved Validation:** More robust server-side and client-side input validation.
*   **Pagination:** For large numbers of events, implement pagination on the event list.
*   **Dedicated ORM:** Integrate a full-fledged ORM like Prisma or Drizzle for more structured database interactions.
*   **Error Handling & Logging:** Comprehensive error handling and server-side logging.
*   **UI/UX Improvements:** Further refine the user interface and experience.

## Contributing
Contributions are welcome! Please feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.