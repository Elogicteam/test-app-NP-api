import "./styles/index.css";

const url = "https://api.novaposhta.ua/v2.0/json/";

const input = document.getElementById("city");
const curier = document.getElementById("curier");
const department = document.getElementById("department");
const cityList = document.getElementById("citylist");
const warehouselist = document.getElementById("warehouselist");
const addressForm = document.querySelector(".address-form");
const departmentForm = document.querySelector(".department-form");

const handleChecked = (e) => {
  const { name } = e.target;
  switch (name) {
  case "curier":
    department.checked = false;
    addressForm.style.display = "block";
    departmentForm.style.display = "none";
    break;
  case "department":
    curier.checked = false;
    departmentForm.style.display = "block";
    addressForm.style.display = "none";
  }
};
async function setCities(value) {
  const options = {
    apiKey: process.env.API_KEY,
    modelName: "Address",
    calledMethod: "searchSettlements",
    methodProperties: {
      CityName: value,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  })
    .then((res) => res.json())
    .then((data) => data);

  getCityList(response);
}

async function setWarehouse(value) {
  const options = {
    apiKey: process.env.API_KEY,
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: value,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  })
    .then((res) => res.json())
    .then((data) => data);
  response.data
    .map((item) => createList(item.Description, warehouselist))
    .join("");
}

const handleChange = (e) => {
  const { value } = e.target;
  value.length >= 3 ? setCities(value) : (warehouselist.innerHTML = null);
};

const getCityList = (response) => {
  warehouselist.innerHTML = null;
  const addresses = response.data[0].Addresses;
  addresses.map((el) => {
    createList(el.Present, cityList);
  });
  const refCity = addresses.map((el) => el.DeliveryCity);
  setWarehouse(refCity[0]);
};

const createList = (props, list) => {
  const optionTeg = document.createElement("option");
  optionTeg.append(props);
  list.append(optionTeg);
};

curier.addEventListener("click", handleChecked);
department.addEventListener("click", handleChecked);
input.addEventListener("input", handleChange);