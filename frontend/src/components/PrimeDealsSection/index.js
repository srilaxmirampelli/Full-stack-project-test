import { Component } from "react";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";

import ProductCard from "../ProductCard";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getPrimeDeals();
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });

    const jwtToken = Cookies.get("jwt_token");
    console.log(jwtToken)

    if (jwtToken === undefined) {
      console.error("JWT Token is missing");
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
      return;
    }

    const apiUrl = "https://apis.ccbp.in/prime-deals";
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };
    console.log(options.headers)

    try {
      const response = await fetch(apiUrl, options);
      console.log(response)
      if (response.ok) {
        const fetchedData = await response.json();
        const updatedData = fetchedData.prime_deals.map((product) => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }));
        this.setState({
          primeDeals: updatedData,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        console.error("API Response Status:", response.status);
        const errorMessage = await response.text();
        console.error("API Response Message:", errorMessage);
        this.setState({
          apiStatus: apiStatusConstants.failure,
        });
      }
    } catch (error) {
      console.error("Error fetching prime deals:", error);
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  renderPrimeDealsListView = () => {
    const { primeDeals } = this.state;
    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map((product) => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    );
  };

  renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="register prime"
      className="register-prime-img"
    />
  );

  renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  );

  render() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsListView();
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  }
}

export default PrimeDealsSection;
