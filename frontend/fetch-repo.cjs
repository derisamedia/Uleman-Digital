const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/repos/derisamedia/uleman-deri/git/trees/main?recursive=1',
  headers: { 'User-Agent': 'node.js agent' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.tree) {
        const cssFiles = parsed.tree.filter(t => t.path.endsWith('.css'));
        console.log('CSS Files:');
        cssFiles.forEach(c => console.log(c.path));
        
        // Fetch the first CSS file to see its contents
        if (cssFiles.length > 0) {
            https.get(`https://raw.githubusercontent.com/derisamedia/uleman-deri/main/${cssFiles[0].path}`, (cssRes) => {
               let cssData = '';
               cssRes.on('data', chunk => cssData += chunk);
               cssRes.on('end', () => console.log('\n--- CSS CONTENT ---\n', cssData));
            });
        }
      } else {
        console.log(parsed);
      }
    } catch(e) {
      console.log('Error parsing', e);
    }
  });
}).on('error', console.error);
