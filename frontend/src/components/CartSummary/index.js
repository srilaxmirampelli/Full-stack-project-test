import './index.css'
import CartContext from '../../context/CartContext'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
      let total = 0
      cartList.forEach(eachCartItem => {
        total += eachCartItem.price * eachCartItem.quantity
      })
      const totalCartItems = cartList.length

      return (
        <div className="cart-summary-card">
          <div className="cart-summary-content">
            <h1 className="cart-summary-total-heading">
              Order Total:
              <span className="cart-summary-total-amount"> Rs {total}/-</span>
            </h1>
            <p className="cart-summary-price-text">
              {totalCartItems} items in cart
            </p>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
