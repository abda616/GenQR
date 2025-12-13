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

## Deployment to Azure

This project includes GitHub Actions workflows to automate the deployment of the backend and frontend to Azure.

### Prerequisites

1.  **Azure Account:** You will need an active Azure subscription.
2.  **Azure CLI:** You will need to have the Azure CLI installed and configured on your local machine.
3.  **GitHub Repository:** Your code should be in a GitHub repository.

### Azure Resources

You will need to create the following resources in Azure:

1.  **Azure Function App:** This will host the Python backend.
2.  **Azure Storage Account:** This will host the static frontend files.

### Configuration

1.  **Update Workflow Files:**
    -   In `.github/workflows/backend-deploy.yml`, replace `'your-function-app-name'` with the name of your Azure Function App.
    -   In `.github/workflows/frontend-deploy.yml`, replace `'your-storage-account-name'` with the name of your Azure Storage Account.

2.  **Configure GitHub Secrets:**
    -   **`AZURE_FUNCTIONAPP_PUBLISH_PROFILE`:**
        -   Go to your Function App in the Azure portal.
        -   Click on "Get publish profile" to download the `.publishsettings` file.
        -   Copy the contents of the file.
        -   In your GitHub repository, go to `Settings > Secrets and variables > Actions` and create a new secret named `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`. Paste the contents of the file as the value.
    -   **`AZURE_CREDENTIALS`:**
        -   Create a service principal in Azure by running the following command:
            ```bash
            az ad sp create-for-rbac --name "GenQRDeploy" --role contributor --scopes /subscriptions/{subscription-id} --sdk-auth
            ```
            Replace `{subscription-id}` with your Azure subscription ID.
        -   The command will output a JSON object. Copy the entire JSON object.
        -   In your GitHub repository, go to `Settings > Secrets and variables > Actions` and create a new secret named `AZURE_CREDENTIALS`. Paste the JSON object as the value.

Once you have configured the secrets and updated the workflow files, the pipelines will automatically deploy the application whenever you push changes to the `main` branch.

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
