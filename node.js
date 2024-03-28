const axios = require('axios');
const { performance } = require('perf_hooks');

// Customizable parameters
const apiUrl = 'https://my1stapi02-us4vzr5p7a-uc.a.run.app/rto?reg_num=OD19J8458'; // Replace with your API endpoint
const numRequests = 100; // Number of requests to send
const concurrency = 10; // Number of concurrent requests

async function testApiPerformance() {
  const startTime = performance.now();

  // Send concurrent requests using Promise.all
  const promises = [];
  for (let i = 0; i < numRequests; i++) {
    promises.push(axios.get(apiUrl));
  }

  try {
    await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Calculate and log performance metrics
    const avgResponseTime = totalTime / numRequests;
    const throughput = numRequests / (totalTime / 1000);

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Throughput: ${throughput.toFixed(2)} requests/second`);
  } catch (error) {
    console.error('Error during API testing:', error);
  }
}

testApiPerformance();