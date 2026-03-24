async function test() {
   console.log("Testing GET /api/analysis...");
   const res1 = await fetch('http://localhost:5000/api/analysis');
   const data1 = await res1.json();
   console.log('Total records:', data1.length);
   
   if (data1.length > 0) {
      const id = data1[0].id;
      console.log(`\nTesting GET /api/trust-score/${id}/explain ...`);
      const res2 = await fetch(`http://localhost:5000/api/trust-score/${id}/explain`);
      const data2 = await res2.json();
      console.log(JSON.stringify(data2, null, 2));
      
      console.log(`\nTesting GET /api/analysis/${id} ...`);
      const res3 = await fetch(`http://localhost:5000/api/analysis/${id}`);
      const data3 = await res3.json();
      console.log(JSON.stringify(data3, null, 2));
      
      console.log("\nTesting POST /api/analyze ...");
      const res4 = await fetch('http://localhost:5000/api/analyze', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ crop: "Corn", location: "Iowa" })
      });
      const data4 = await res4.json();
      console.log(JSON.stringify(data4, null, 2));
   }
}
test();
