const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
    let result = null;
    let browser = null;
    
    try {
        const body = JSON.parse(event.body);
        const html = body.html;

        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.setContent(html);
        
        const pdfBuffer = await page.pdf({ format: 'A4' });

        result = pdfBuffer.toString('base64');  // Convert the PDF data to a base64 string

    } catch (error) {
        return context.fail(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
            'Content-Type': 'application/pdf',
        },
        body: result
    };
};
