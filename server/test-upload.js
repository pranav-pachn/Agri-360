const fetch = require('node-fetch');
const FormData = require('form-data');

async function testUpload() {
  const form = new FormData();
  form.append('crop', 'Tomato');
  form.append('location', 'Test');
  
  form.append('image', Buffer.alloc(10), { filename: 'test.jpg', contentType: 'image/jpeg' });

  try {
    const res = await fetch('http://localhost:5001/api/analyze', {
      method: 'POST',
      body: form,
      headers: form.getHeaders() // Crucial for node-fetch to properly trigger multer
    });
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', text);
  } catch(e) { 
    console.error(e); 
  }
}
testUpload();
