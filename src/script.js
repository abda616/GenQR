document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const qrTextInput = document.getElementById('qrText');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const logoFileInput = document.getElementById('logoFile');
    const clearLogoBtn = document.getElementById('clearLogoBtn');

    const generateQRCode = async () => {
        const url = qrTextInput.value.trim();
        const logoFile = logoFileInput.files[0];

        if (!url) {
            alert("Please enter a URL.");
            qrTextInput.focus();
            return;
        }

        const formData = new FormData();
        formData.append('url', url);
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            const response = await fetch('http://localhost:8000/generate/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate QR code.');
            }

            const svgBlob = await response.blob();
            const svgUrl = URL.createObjectURL(svgBlob);

            qrCodeContainer.innerHTML = `<img src="${svgUrl}" alt="QR Code">`;
            downloadBtn.hidden = false;

            // Store the SVG blob for download
            downloadBtn.dataset.svgUrl = URL.createObjectURL(svgBlob);

        } catch (error) {
            console.error('Error generating QR code:', error);
            alert(`Could not generate QR code: ${error.message}`);
        }
    };

    const downloadQRCode = () => {
        const svgUrl = downloadBtn.dataset.svgUrl;
        if (svgUrl) {
            const link = document.createElement('a');
            link.href = svgUrl;
            link.download = 'qrcode.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Please generate a QR code first.");
        }
    };

    const clearLogo = () => {
        logoFileInput.value = '';
        clearLogoBtn.hidden = true;
    };

    logoFileInput.addEventListener('change', () => {
        if (logoFileInput.files.length > 0) {
            clearLogoBtn.hidden = false;
        } else {
            clearLogoBtn.hidden = true;
        }
    });

    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    clearLogoBtn.addEventListener('click', clearLogo);

    qrTextInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
});
