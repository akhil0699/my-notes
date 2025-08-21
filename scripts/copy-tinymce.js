const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  try {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      // Create destination directory if it doesn't exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      // Read all files/folders in source directory
      const files = fs.readdirSync(src);
      
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        copyRecursive(srcPath, destPath);
      });
    } else {
      // Copy file
      fs.copyFileSync(src, dest);
    }
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error.message);
  }
}

function copyTinyMCE() {
  const srcPath = path.join(__dirname, '..', 'node_modules', 'tinymce');
  const destPath = path.join(__dirname, '..', 'public', 'tinymce');
  
  console.log('Copying TinyMCE to public folder...');
  
  // Check if source exists
  if (!fs.existsSync(srcPath)) {
    console.log('TinyMCE not found in node_modules. Skipping copy.');
    return;
  }
  
  // Remove existing destination if it exists
  if (fs.existsSync(destPath)) {
    fs.rmSync(destPath, { recursive: true, force: true });
  }
  
  // Copy TinyMCE
  copyRecursive(srcPath, destPath);
  
  console.log('TinyMCE copied successfully!');
}

// Run the copy operation
copyTinyMCE();
