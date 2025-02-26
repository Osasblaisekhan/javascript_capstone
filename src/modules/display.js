export const fetchData = async () => {
  const response = await fetch('https://api.tvmaze.com/shows?embed=episodes');
  const data = await response.json();
  return data;
};

export const upDateDoM = async () => {
  const data = await fetchData();
  const container = document.getElementById('container');
  const subContainer = document.createElement('div');
  subContainer.classList.add('sub-container');
  subContainer.innerHTML = data.map((item) => `
        <div " class="sub-container">

        <div class="box">
        <div class="image-container">
        <img class="image-contain" src="${item.image.original}" alt="${item.name}"/>
        
        </div>
            <h1>${item.name}</h1>
        </div>

        </div>
    `);
  container.appendChild(subContainer);
};
upDateDoM();