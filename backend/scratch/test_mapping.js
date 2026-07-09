import { setAiClient } from '../src/config/gemini.js';

// Define a mock Gemini client
const mockAiClient = {
  models: {
    generateContent: async ({ contents, model, config }) => {
      console.log(`[Mock Gemini] Generating content for model: ${model}...`);
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        text: JSON.stringify([
          {
            name: "John Doe",
            email: "john@example.com",
            company: "Acme Corp",
            city: "New York",
            country: "USA",
            crm_status: "GOOD_LEAD_FOLLOW_UP",
            data_source: "leads_on_demand",
            description: "Automated test record"
          },
          {
            name: "Jane Smith",
            email: "jane@example.com",
            company: "Globex",
            city: "San Francisco",
            country: "USA",
            crm_status: "SALE_DONE",
            data_source: "leads_on_demand",
            description: "Automated test record 2"
          }
        ])
      };
    }
  }
};

// Inject the mock Gemini client
setAiClient(mockAiClient);
console.log('Injected mock Gemini API client.');

// Create express app server instance or make HTTP requests to the running server.
// Since the running server has its own process, we can just make HTTP requests to localhost:5001,
// but wait, the running server process does not have our mock injected!
// So let's run the Express app locally within this script to test the full flow!
import app from '../app.js';

const server = app.listen(5002, async () => {
  console.log('Test server started on port 5002');

  try {
    const testRecords = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ];

    console.log('Sending async import request to http://localhost:5002/api/import...');
    const response = await fetch('http://localhost:5002/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        records: testRecords,
        runSync: false,
        batchSize: 1
      })
    });

    const body = await response.json();
    console.log('Initial response:', JSON.stringify(body, null, 2));

    if (!body.success) {
      throw new Error('Async request failed: ' + body.message);
    }

    const { jobId } = body.data;

    // Poll status
    let status = body.data.status;
    let attempts = 0;
    while (status !== 'completed' && status !== 'failed' && attempts < 10) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 500));
      const statusRes = await fetch(`http://localhost:5002/api/import/status/${jobId}`);
      const statusBody = await statusRes.json();
      status = statusBody.data.status;
      console.log(`Poll #${attempts}: Status = ${status}, Progress = ${statusBody.data.progress}%`);
      
      if (status === 'completed') {
        console.log('Job completed! Final Result:');
        console.log(JSON.stringify(statusBody.data.result, null, 2));
      } else if (status === 'failed') {
        console.log('Job failed! Error:', statusBody.data.error);
      }
    }
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close(() => {
      console.log('Test server closed.');
      process.exit(0);
    });
  }
});
