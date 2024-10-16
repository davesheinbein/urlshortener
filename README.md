# URL Shortener Microservice

This is a URL Shortener Microservice built with Node.js,
Express, and MongoDB.

## Live Demo

[https://freecodecam-boilerplate-1yzjyvdq8yr.ws-us116.gitpod.io/](https://freecodecam-boilerplate-1yzjyvdq8yr.ws-us116.gitpod.io/)

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/davesheinbein/urlshortener.git
   cd url-shortener
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your
   MongoDB URI:

   ```env
   MONGO_URI=your_mongodb_uri
   PORT=3000
   ```

4. Start the server:
   ```sh
   npm start
   ```

## Endpoints

### POST `/api/shorturl`

- **Description**: Shortens a given URL.
- **Request Body**:
  ```json
  {
  	"url": "https://www.example.com"
  }
  ```
- **Response**:
  ```json
  {
  	"original_url": "https://www.example.com",
  	"short_url": 1
  }
  ```

### GET `/api/shorturl/:short_url`

- **Description**: Redirects to the original URL
  corresponding to the given short URL.
- **Response**: Redirects to the original URL or returns an
  error if the short URL is not found.

## Example Usage

1. Shorten a URL:

   ```sh
   curl -X POST -H "Content-Type: application/json" -d '{"url":"https://www.example.com"}' http://localhost:3000/api/shorturl
   ```

2. Redirect to the original URL:
   ```sh
   curl -L http://localhost:3000/api/shorturl/1
   ```
