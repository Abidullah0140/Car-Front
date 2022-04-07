import React, { Component } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "../constants.js";
import AddCar from "./AddCar";

class Carlist extends Component {
  constructor(props) {
    super(props);
    this.state = { cars: [] };
  }
  // Add new car
  addCar(car) {
    fetch(SERVER_URL + "api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((res) => this.fetchCars())
      .catch((err) => console.error(err));
  }
  //Fetch cars from the SpringBoot application
  fetchCars = () => {
    fetch(SERVER_URL + "api/cars")
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          cars: responseData._embedded.cars,
        });
      })
      .catch((err) => console.error(err));
  };
  componentDidMount() {
    this.fetchCars();
  }
  // Delete car
  onDelClick = (link) => {
    if (window.confirm("Are you sure you want to delete")) {
      fetch(link, { method: "DELETE" })
        .then((res) => {
          toast.success("Car deleted", {
            position: toast.POSITION.TOP_CENTER,
          });
          this.fetchCars();
        })
        .catch((err) => {
          toast.error("Error when deleting", {
            position: toast.POSITION.TOP_CENTER,
          });
          console.error(err);
        });
    }
  };
  render() {
    const columns = [
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Model",
        accessor: "model",
      },
      {
        Header: "Color",
        accessor: "color",
      },
      {
        Header: "Year",
        accessor: "year",
      },
      {
        Header: "Price €",
        accessor: "price",
      },
      {
        id: "delbutton",
        sortable: false,
        filterable: false,
        width: 100,
        accessor: "_links.self.href",
        Cell: ({ value }) => (
          <button
            onClick={() => {
              this.onDelClick(value);
            }}
          >
            Delete
          </button>
        ),
      },
    ];
    // Carlist.js
    return (
      <div className="App">
        <AddCar addCar={this.addCar} fetchCars={this.fetchCars} />
        <ReactTable
          data={this.state.cars}
          columns={columns}
          filterable={true}
          pageSize={10}
        />
        <ToastContainer autoClose={1500} />
      </div>
    );
  }
  //   render() {
  //     const tableRows = this.state.cars.map((car, index) =>

  //     <tr key={index}>

  //     <td>{car.brand}</td>

  //     <td>{car.model}</td>
  //     <td>{car.color}</td>
  //     <td>{car.year}</td>
  //     <td>{car.price}</td>
  //     </tr>
  //     );
  //     return (
  //         <div className="App">
  //         <table>
  //         <tbody>{tableRows}</tbody>
  //         </table>
  //         </div>
  //         );
  //         }
}
export default Carlist;
