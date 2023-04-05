const apiKey = "ADD YOUR API KEY HERE";
const gridContainer = document.getElementById("gridContainer");

const fruitTreeNames = [
  "Yellow Jackfruit",
  "Honey Jackfruit",
  "Orange Jackfruit",
  "Red Jackfruit",
  "Chempejack",
  "Mini Chempedak",
  "Chempedak King"
];
function createGridItem(treeName, imageUrl) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");

  const title = document.createElement("h3");
  title.innerText = treeName;
  gridItem.appendChild(title);

  const imageLink = document.createElement("a");
  imageLink.href = imageUrl;
  imageLink.download = `${treeName}.jpg`; // Set the download attribute
  gridItem.appendChild(imageLink);

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = treeName;
  imageLink.appendChild(image); // Append the image to the anchor element

  return gridItem;
}

async function fetchImages() {
  for (const treeName of fruitTreeNames) {
    const response = await fetch("/api/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "image-alpha-001",
        prompt: `A beautiful image of a ${treeName}`,
        n: 1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data.length > 0) {
        const imageUrl = data.data[0].url;
        const gridItem = createGridItem(treeName, imageUrl);
        gridContainer.appendChild(gridItem);
      } else {
        console.error("No image found for " + treeName);
      }
    } else {
      console.error("Error fetching image for " + treeName);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a delay of 3 seconds
  }
}
async function downloadImage(url, title) {
  const proxyUrl = 'http://localhost:8080/';
  const response = await fetch(proxyUrl + url);
  const blob = await response.blob();

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function saveAllImages() {
  const gridItems = document.querySelectorAll('.grid-item');
  
  gridItems.forEach(item => {
    const title = item.querySelector('h3').innerText;
    const img = item.querySelector('img');
    
    if (img) {
      const imgUrl = img.src;
      downloadImage(imgUrl, title);
    }
  });
}
const saveButton = document.getElementById('savenow');
if (saveButton) {
  saveButton.addEventListener('click', saveAllImages);
} else {
  console.error('Save button with id "savenow" not found');
}
// Call the saveAllImages function to start the download process

fetchImages();
