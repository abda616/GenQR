from fastapi import FastAPI, File, UploadFile, Form
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import segno
from io import BytesIO
from starlette.responses import Response, JSONResponse
from PIL import Image
import cairosvg
import base64
import xml.etree.ElementTree as ET
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SVG_NS = "http://www.w3.org/2000/svg"

@app.post("/generate/")
async def generate_qr_code(url: str = Form(...), logo: Optional[UploadFile] = File(None)):
    """
    Generates a QR code with an optional logo in the center, outputting a single SVG file.
    """
    try:
        # 1. Generate the base QR code as an SVG
        qr_svg_buffer = BytesIO()
        qrcode = segno.make(url, error='h')
        qrcode.save(qr_svg_buffer, kind='svg', scale=10, border=4)
        qr_svg_buffer.seek(0)

        # If no logo is provided, return the plain SVG
        if not logo:
            return Response(content=qr_svg_buffer.read(), media_type="image/svg+xml")

        # --- If a logo is provided, proceed with embedding it ---
        logo_bytes = await logo.read()

        # 2. Parse the SVG XML
        ET.register_namespace("", SVG_NS)
        tree = ET.parse(qr_svg_buffer)
        root = tree.getroot()

        # 3. Convert logo to a base64-encoded PNG
        logo_png_bytes = logo_bytes
        if logo.content_type == 'image/svg+xml' or (logo.filename and logo.filename.lower().endswith('.svg')):
            logo_png_bytes = cairosvg.svg2png(bytestring=logo_bytes, output_width=100, output_height=100)

        logo_img = Image.open(BytesIO(logo_png_bytes))

        logo_buffer = BytesIO()
        logo_img.save(logo_buffer, format="PNG")
        logo_base64 = base64.b64encode(logo_buffer.getvalue()).decode('utf-8')

        # 4. Calculate dimensions and positions
        qr_width = int(root.get('width'))
        qr_height = int(root.get('height'))
        logo_size = int(qr_width * 0.25)

        x_pos = (qr_width - logo_size) / 2
        y_pos = (qr_height - logo_size) / 2

        # 5. Add a white background for the logo
        bg_rect = ET.Element(f'{{{SVG_NS}}}rect', {
            'x': str(x_pos - 2),
            'y': str(y_pos - 2),
            'width': str(logo_size + 4),
            'height': str(logo_size + 4),
            'fill': 'white'
        })
        root.append(bg_rect)

        # 6. Embed the logo as an <image> element
        image_element = ET.Element(f'{{{SVG_NS}}}image', {
            'x': str(x_pos),
            'y': str(y_pos),
            'width': str(logo_size),
            'height': str(logo_size),
            'href': f'data:image/png;base64,{logo_base64}'
        })
        root.append(image_element)

        # 7. Serialize the modified SVG back to a string
        final_svg_bytes = ET.tostring(root, encoding='utf-8', method='xml')

        return Response(content=final_svg_bytes, media_type="image/svg+xml")

    except Exception as e:
        logger.error(f"Error generating QR code: {e}", exc_info=True)
        return JSONResponse(content={"error": "An unexpected error occurred."}, status_code=500)

@app.get("/")
def read_root():
    return {"message": "QR Code Generator Backend"}
