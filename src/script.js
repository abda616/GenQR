document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const qrTextInput = document.getElementById('qrText');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    let qrcode = null; // To hold the QRCode instance
    
    const generateQRCode = () => {
        const text = qrTextInput.value.trim();

        if (!text) {
            alert("Please enter some text or a URL.");
            qrTextInput.focus();
            return;
        }

        // Clear previous QR code
        qrCodeContainer.innerHTML = '';
        // The download button is hidden until the canvas is ready
        downloadBtn.hidden = true;

        // Generate new QR code
        qrcode = new QRCode(qrCodeContainer, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Use a MutationObserver to reliably wait for the <img> to be created.
        const observer = new MutationObserver((mutationsList, obs) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const qrImage = qrCodeContainer.querySelector('img');
                    if (qrImage) {
                        qrImage.style.display = 'none'; // Hide the original library-generated image
                        addLogoAndCreateCanvas(qrImage);
                        obs.disconnect(); // Stop observing once we have the image
                        return;
                    }
                }
            }
        });

        observer.observe(qrCodeContainer, { childList: true });
    };

    const addLogoAndCreateCanvas = (qrImage) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const size = 256;
        canvas.width = size;
        canvas.height = size;

        // Draw the QR code image onto the canvas first
        context.drawImage(qrImage, 0, 0, size, size);

        // Prepare to draw the logo
        const logo = new Image();
        logo.crossOrigin = "Anonymous"; // Required for cross-origin images on canvas

        // Using a CORS proxy to ensure the image has the correct headers
        const logoUrl = 'https://lh3.googleusercontent.com/p/AF1QipP9Vhru4PEjfOIZC6R38AP4OZfG5NzH8kTZEMHF=s1360-w1360-h1020-rw';
        const proxiedLogoUrl = `https://corsproxy.io/?${encodeURIComponent(logoUrl)}`;
        logo.src = proxiedLogoUrl;

        logo.onload = () => {
            const logoSize = size * 0.25; // Logo will be 25% of the QR code size
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            const padding = 5;

            // Add a white background behind the logo for better readability
            context.fillStyle = '#ffffff';
            context.fillRect(logoX - padding, logoY - padding, logoSize + (padding * 2), logoSize + (padding * 2));

            // Draw the logo
            context.drawImage(logo, logoX, logoY, logoSize, logoSize);

            // Replace the original image with our new canvas
            qrCodeContainer.appendChild(canvas);
            downloadBtn.hidden = false; // Show download button
        };

        logo.onerror = () => {
            // If the logo fails, show an alert and display the QR code without it.
            alert("Could not load the logo. Displaying QR code without it.");
            qrImage.style.display = 'block'; // Show the original QR code
            downloadBtn.hidden = false; // Still allow downloading the plain QR
        };
    };

    const downloadQRCode = () => {
        const canvas = qrCodeContainer.querySelector('canvas');
        if (canvas) {
            // Download from canvas if it exists (with logo)
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Fallback to download the original image if canvas failed (e.g., logo error)
            const img = qrCodeContainer.querySelector('img');
            if (img) {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = 'qrcode.png';
                link.click();
            } else {
                alert("Please generate a QR code first.");
            }
        }
    };

    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);

    qrTextInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
});
