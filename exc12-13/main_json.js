
currentPage = 1;
const itemsPerPage = 10;
const baseURL = "http://localhost:3001/user";
const elemFormCreate = document.querySelector("#formCreate");
const elemInputTitle = elemFormCreate.querySelectorAll("input")[0];
const elemInputViews = elemFormCreate.querySelectorAll("input")[1];
const elemPostsLength = document.querySelector("#postLength");
const elemFormDelete = document.querySelector("#formDelete");
const elemInputIdToDelete = elemFormDelete.querySelector("input");
elemFormCreate.addEventListener("submit", addPost);
elemFormDelete.addEventListener("submit", deletePost);
const elemSuccess = document.querySelector("#success");
const elemFailure = document.querySelector("#failure");
///////// paging
const fetchPaginatedData = async (page, limit) => {
  try {
    console.log(`Fetching page ${page}`);
    const response = await axios.get(
      baseURL + `/?_page=${page}&_per_page=${limit}`
    );
    const data = response.data.data;
    const totalItems = parseInt(response.headers["x-total-count"], 10);
    console.log(`Fetched ${data.length} items from page ${page}`);
    return { data, totalItems };
  } catch (error) {
    console.error("Fetching data failed:", error);
    return { data: [], totalItems: 0 };
  }
};

const loadMoreData = async () => {
  const { data, totalItems } = await fetchPaginatedData(
    currentPage,
    itemsPerPage
  );
  // Update your UI with the fetched data
  console.log("Page: " + currentPage);
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = "";
  let table = document.createElement("table");
  const headers = Object.keys(data[0]);
  headers.forEach((header) => {
    const headerElement = document.createElement("th");
    headerElement.textContent = header;
    table.appendChild(headerElement);
  });
  data.forEach((item) => {
    const rowElement = document.createElement("tr");
    Object.keys(item).forEach((key) => {
      const itemTableElement = document.createElement("td");
      itemTableElement.id = `item-${key}`;
      itemTableElement.textContent = JSON.stringify(item[key]);
      rowElement.appendChild(itemTableElement);
    });

    table.appendChild(rowElement);
  });

  dataContainer.appendChild(table);

  // Increment the current page for the next fetch
  currentPage++;

  // Check if there are more items to load
  if ((currentPage - 1) * itemsPerPage >= totalItems) {
    console.log("All items have been loaded.");
    document.getElementById("loadMoreButton").disabled = true;
  }
};

//add delete
function addPost(e) {
  e.preventDefault();
  const formData = new FormData(elemFormCreate);
  resetAlert();
  // Convert FormData to a plain object
  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  console.log(formDataObj); // Check the converted form data object

  axios
    .post(baseURL, formDataObj, {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      setSuccess();
    })
    .catch(function (error) {
      console.error(error);
      setFailure();
    });
}

async function deletePost(e) {
  e.preventDefault();
  console.log("delete");
  resetAlert();
  const url = `${baseURL}/${elemInputIdToDelete.value}`;
  await axios.delete(url).then(setSuccess).catch(setFailure);
}
function setFailure() {
  elemFailure.innerText = "failure";
}
function setSuccess() {
  elemSuccess.innerText = "success";
}

function resetAlert() {
  elemSuccess.innerText = "";
  elemFailure.innerText = "";
}

// Attach event listener to the load more button
document
  .getElementById("loadMoreButton")
  .addEventListener("click", loadMoreData);
