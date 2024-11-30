(async function() {
    // Constants
    const projectID = id-here;
    const language = 'en'; // Change to 'es' for Spanish
    const baseStudioUrl = 'https://api.scratch.mit.edu/explore/studios';
    const addProjectUrl = (studioId) => https://api.scratch.mit.edu/studios/${studioId}/project/${projectID};
    const headers = {
    };
  
    let offset = 0;
    let isRunning = true;
  
    async function fetchStudios(offset) {
      const url = ${baseStudioUrl}?limit=40&offset=${offset}&language=${language}&mode=trending&q=*;
      const response = await fetch(url, { headers, method: 'GET' });
      if (!response.ok) throw new Error(Failed to fetch studios: ${response.statusText});
      return response.json();
    }
  
    async function addProjectToStudio(studioId) {
      const url = addProjectUrl(studioId);
      const response = await fetch(url, { headers, method: 'POST' });
  
      if (response.status === 429) { // Too Many Requests
        console.error("Too many requests. Terminating script.");
        isRunning = false;
        return;
      }
  
      if (response.status === 403) {
        console.log(Studio ${studioId} does not allow adding projects.);
      } else if (response.ok) {
        console.log(Successfully added project to studio ${studioId});
      } else {
  console.error(Error adding project to studio ${studioId}: ${response.statusText});
      }
    }
  
    async function processStudios() {
      while (isRunning) {
        try {
          const studios = await fetchStudios(offset);
          if (studios.length === 0) {
            console.log("No more studios to process.");
            break;
          }
  
          for (const studio of studios) {
            const studioId = studio.id;
            try {
              await addProjectToStudio(studioId);
            } catch (err) {
              console.error(Error processing studio ${studioId}:, err.message);
            }
          }
  
          offset += 40; // Move to the next set of studios
        } catch (err) {
          console.error("Error fetching studios:", err.message);
        }
  
        // Wait before next batch
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  
    // Stop script by typing isRunning = false in the console
    console.log("Starting script. Type 'isRunning = false' in console to stop.");
    await processStudios();
  })();
