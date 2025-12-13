# GenQR: QR Code Generator

GenQR is a web-based QR code generator that allows you to create custom QR codes with an embedded logo. This application is built with a Python backend using FastAPI and a vanilla JavaScript frontend.

## Features

-   **Custom Logo:** Embed your own logo in the center of the QR code.
-   **SVG Output:** Generates a high-quality SVG file for the QR code.
-   **File Upload:** Supports uploading logo files in various formats (SVG, PNG, JPG, etc.).

## Installation

### Backend

1.  **Navigate to the `qr-qode` directory:**
    ```bash
    cd qr-qode
    ```

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -e .
    ```

### Frontend

There are no specific installation steps for the frontend, as it is built with vanilla JavaScript.

## Running the Application

### Backend

1.  **Navigate to the `qr-qode` directory:**
    ```bash
    cd qr-qode
    ```

2.  **Start the FastAPI server:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```

### Frontend

1.  **Navigate to the `src` directory:**
    ```bash
    cd src
    ```

2.  **Start the Python HTTP server:**
    ```bash
    python3 -m http.server 8080
    ```

Once both servers are running, you can access the application at `http://localhost:8080`.

## Usage

1.  **Enter the URL:** Type or paste the URL you want to encode in the input field.
2.  **Upload a logo:** Click the "Choose a logo" button to select a logo file from your computer.
3.  **Generate the QR code:** Click the "Generate QR Code" button.
4.  **Download the QR code:** Click the "Download QR Code" button to save the generated SVG file.

## Technologies Used

-   **Backend:**
    -   [FastAPI](https://fastapi.tiangolo.com/)
    -   [Segno](https://segno.readthedocs.io/en/latest/)
    -   [Pillow](https://python-pillow.org/)
    -   [CairoSVG](https://cairosvg.org/)

-   **Frontend:**
    -   Vanilla JavaScript
    -   HTML5
    -   CSS3
